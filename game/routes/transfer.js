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

const players = await Player.find({
isListed:true
})
.populate("team","name")
.sort({createdAt:-1});

res.json(players);

});


/* =====================================================
SPIELER LISTEN
===================================================== */

router.post("/list/:playerId", auth, async (req,res)=>{

const { type, price, duration } = req.body;

const player = await Player.findById(req.params.playerId);

if(!player) return res.status(404).json({message:"Spieler nicht gefunden"});

player.isListed = true;
player.transferType = type;
player.transferPrice = price;

if(type === "auction"){

const end = new Date();

end.setHours(end.getHours() + duration);

player.auctionEnd = end;

}

await player.save();

res.json({message:"Spieler auf Transfermarkt"});

});


/* =====================================================
SOFORT KAUF
===================================================== */

router.post("/buy/:playerId", auth, async (req,res)=>{

const buyerTeam = await Team.findOne({owner:req.user.userId});

const player = await Player.findById(req.params.playerId);

if(!player || !player.isListed) return res.status(400).json({message:"Nicht verfügbar"});

const sellerTeam = await Team.findById(player.team);

if(buyerTeam.balance < player.transferPrice){

return res.status(400).json({message:"Nicht genug Geld"});

}

buyerTeam.balance -= player.transferPrice;
sellerTeam.balance += player.transferPrice;

player.team = buyerTeam._id;
player.isListed = false;

await buyerTeam.save();
await sellerTeam.save();
await player.save();

res.json({message:"Spieler gekauft"});

});


/* =====================================================
BID
===================================================== */

router.post("/bid/:playerId", auth, async (req,res)=>{

const { amount } = req.body;

const player = await Player.findById(req.params.playerId);

if(!player || player.transferType !== "auction"){

return res.status(400).json({message:"Keine Auktion"});

}

if(amount <= player.currentBid){

return res.status(400).json({message:"Gebot zu niedrig"});

}

const team = await Team.findOne({owner:req.user.userId});

player.currentBid = amount;
player.highestBidder = team._id;

await TransferBid.create({

player:player._id,
bidder:team._id,
amount

});

await player.save();

res.json({message:"Gebot abgegeben"});

});

module.exports = router;