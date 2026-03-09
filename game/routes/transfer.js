const express = require("express");
const router = express.Router();

const Player = require("../models/Player");
const Team = require("../models/Team");
const TransferBid = require("../models/TransferBid");

const auth = require("../middleware/auth");

const { executeTransfer } = require("../services/transferService");

/* =====================================================
MARKT LADEN
===================================================== */

router.get("/market", async (req,res)=>{

try{

const players = await Player.find({
isListed:true
})
.select("firstName lastName stars team transferPrice transferType auctionEnd currentBid")
.populate("team","name shortName")
.sort({ createdAt:-1 })
.lean();

res.json(players);

}catch(err){

console.error("Market Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});


/* =====================================================
SPIELER LISTEN
===================================================== */

router.post("/list/:playerId", auth, async (req,res)=>{

try{

const { type, price, duration } = req.body;

const team = await Team.findOne({
owner:req.user.userId
});

if(!team){
return res.status(404).json({message:"Team nicht gefunden"});
}

const player = await Player.findById(req.params.playerId);

if(!player){
return res.status(404).json({message:"Spieler nicht gefunden"});
}

/* Spieler gehört Team */

if(player.team.toString() !== team._id.toString()){
return res.status(403).json({message:"Nicht dein Spieler"});
}

/* Bereits gelistet */

if(player.isListed){
return res.status(400).json({message:"Spieler bereits auf Markt"});
}

/* Markt setzen */

player.isListed = true;
player.transferType = type;
player.transferPrice = price;

/* Auktion */

if(type === "auction"){

const end = new Date();
end.setHours(end.getHours() + (duration || 24));

player.auctionEnd = end;

/* Startgebot */

player.currentBid = 0;
player.highestBidder = null;

}

await player.save();

res.json({
message:"Spieler auf Transfermarkt"
});

}catch(err){

console.error("List Player Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});


/* =====================================================
SOFORT KAUF
===================================================== */

router.post("/buy/:playerId", auth, async (req,res)=>{

try{

const buyerTeam = await Team.findOne({
owner:req.user.userId
});

if(!buyerTeam){
return res.status(404).json({message:"Team nicht gefunden"});
}

const player = await Player.findById(req.params.playerId);

if(!player || !player.isListed){

return res.status(400).json({
message:"Spieler nicht verfügbar"
});

}

const sellerTeam = await Team.findById(player.team);

/* Eigenen Spieler kaufen verhindern */

if(buyerTeam._id.toString() === sellerTeam._id.toString()){
return res.status(400).json({
message:"Eigene Spieler können nicht gekauft werden"
});
}

/* Geld prüfen */

if(buyerTeam.balance < player.transferPrice){

return res.status(400).json({
message:"Nicht genug Geld"
});

}

/* Transfer sicher durchführen */

await executeTransfer(
player._id,
buyerTeam._id,
player.transferPrice
);

res.json({
message:"Spieler gekauft"
});

}catch(err){

console.error("Buy Player Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});


/* =====================================================
BID
===================================================== */

router.post("/bid/:playerId", auth, async (req,res)=>{

try{

const { amount } = req.body;

const player = await Player.findById(req.params.playerId);

if(!player || player.transferType !== "auction"){

return res.status(400).json({
message:"Keine Auktion"
});

}

/* Auktion beendet */

if(player.auctionEnd && new Date() > player.auctionEnd){

return res.status(400).json({
message:"Auktion beendet"
});

}

const team = await Team.findOne({
owner:req.user.userId
});

if(!team){
return res.status(404).json({message:"Team nicht gefunden"});
}

/* Eigenen Spieler bieten verhindern */

if(player.team.toString() === team._id.toString()){
return res.status(400).json({
message:"Du kannst nicht auf deinen eigenen Spieler bieten"
});
}

/* Mindestgebot */

const minBid = player.currentBid || player.transferPrice;

if(amount <= minBid){

return res.status(400).json({
message:"Gebot zu niedrig"
});

}

/* Geld prüfen */

if(team.balance < amount){

return res.status(400).json({
message:"Nicht genug Geld"
});

}

/* Gebot speichern */

player.currentBid = amount;
player.highestBidder = team._id;

/* =====================================================
ANTI SNIPING
===================================================== */

const remainingSeconds =
(player.auctionEnd - new Date()) / 1000;

if(remainingSeconds < 60){

const newEnd = new Date();
newEnd.setSeconds(newEnd.getSeconds()+60);

player.auctionEnd = newEnd;

}

/* Gebot speichern */

await TransferBid.create({

player:player._id,
bidder:team._id,
amount

});

await player.save();

res.json({
message:"Gebot abgegeben"
});

}catch(err){

console.error("Bid Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});


module.exports = router;