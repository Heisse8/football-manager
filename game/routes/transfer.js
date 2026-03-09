const express = require("express");
const router = express.Router();

const Player = require("../models/Player");
const Team = require("../models/Team");
const TransferBid = require("../models/TransferBid");

const auth = require("../middleware/auth");

/* =====================================================
MARKT LADEN
===================================================== */

router.get("/market", async (req,res)=>{

try{

const players = await Player.find({
isListed:true
})
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

/* Spieler gehört Team? */

if(player.team.toString() !== team._id.toString()){
return res.status(403).json({message:"Nicht dein Spieler"});
}

/* Bereits gelistet */

if(player.isListed){
return res.status(400).json({message:"Spieler bereits auf Markt"});
}

player.isListed = true;
player.transferType = type;
player.transferPrice = price;

/* Auktion */

if(type === "auction"){

const end = new Date();
end.setHours(end.getHours() + (duration || 24));

player.auctionEnd = end;
player.currentBid = price;

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
return res.status(400).json({message:"Eigene Spieler können nicht gekauft werden"});
}

if(buyerTeam.balance < player.transferPrice){

return res.status(400).json({
message:"Nicht genug Geld"
});

}

/* Geld transfer */

buyerTeam.balance -= player.transferPrice;
sellerTeam.balance += player.transferPrice;

/* Spieler transfer */

player.team = buyerTeam._id;
player.isListed = false;
player.transferType = null;
player.transferPrice = null;
player.auctionEnd = null;
player.currentBid = null;
player.highestBidder = null;

await Promise.all([
buyerTeam.save(),
sellerTeam.save(),
player.save()
]);

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