const express = require("express");
const router = express.Router();

const Player = require("../models/Player");
const Scout = require("../models/Scout");
const Coach = require("../models/Coach");
const Team = require("../models/Team");

const auth = require("../middleware/auth");

/* =====================================================
MARKT – SPIELER LISTE
===================================================== */

router.get("/players", async (req,res)=>{

try{

const players = await Player.find({
isListed:true
}).populate("team","name shortName");

res.json(players);

}catch(err){

console.error(err);
res.status(500).json({message:"Serverfehler"});

}

});

/* =====================================================
MARKT – SCOUT LISTE
===================================================== */

router.get("/scouts", async (req,res)=>{

try{

const scouts = await Scout.find({
isListed:true
});

res.json(scouts);

}catch(err){

console.error(err);
res.status(500).json({message:"Serverfehler"});

}

});

/* =====================================================
MARKT – COACH LISTE
===================================================== */

router.get("/coaches", async (req,res)=>{

try{

const coaches = await Coach.find({
isListed:true
});

res.json(coaches);

}catch(err){

console.error(err);
res.status(500).json({message:"Serverfehler"});

}

});

/* =====================================================
SPIELER AUKTION STARTEN
===================================================== */

router.post("/list-auction", auth, async (req,res)=>{

try{

const { playerId, startPrice, duration } = req.body;

const player = await Player.findById(playerId);

if(!player){
return res.status(404).json({message:"Spieler nicht gefunden"});
}

const team = await Team.findOne({
owner:req.user.userId
});

if(!team){
return res.status(404).json({message:"Kein Team"});
}

if(player.team.toString() !== team._id.toString()){
return res.status(403).json({message:"Nicht dein Spieler"});
}

/* Mindestpreis = 50% Marktwert */

if(startPrice < player.marketValue * 0.5){
return res.status(400).json({
message:"Startpreis muss mindestens 50% des Marktwerts sein"
});
}

/* Dauer */

let hours = 24;

if(duration === 48) hours = 48;
if(duration === 72) hours = 72;

const end = new Date();
end.setHours(end.getHours()+hours);

/* Auktion starten */

player.isListed = true;
player.transferType = "auction";
player.highestBid = startPrice;
player.highestBidder = null;
player.auctionEnd = end;
player.sellerTeam = team._id;

await player.save();

res.json({message:"Auktion gestartet"});

}catch(err){

console.error(err);
res.status(500).json({message:"Serverfehler"});

}

});

/* =====================================================
GEBOT ABGEBEN
===================================================== */

router.post("/bid", auth, async (req,res)=>{

try{

const { playerId, bid } = req.body;

const player = await Player.findById(playerId);

if(!player || player.transferType !== "auction"){
return res.status(404).json({message:"Keine Auktion"});
}

if(new Date() > player.auctionEnd){
return res.status(400).json({message:"Auktion beendet"});
}

if(bid <= player.highestBid){
return res.status(400).json({message:"Gebot zu niedrig"});
}

const team = await Team.findOne({
owner:req.user.userId
});

if(!team){
return res.status(404).json({message:"Kein Team"});
}

if(team.balance < bid){
return res.status(400).json({message:"Zu wenig Geld"});
}

/* neues Gebot */

player.highestBid = bid;
player.highestBidder = team._id;

/* ================= ANTI SNIPING ================= */

const remainingSeconds =
(player.auctionEnd - new Date()) / 1000;

if(remainingSeconds < 60){

const newEnd = new Date();
newEnd.setSeconds(newEnd.getSeconds()+60);

player.auctionEnd = newEnd;

}

await player.save();

res.json({message:"Gebot erfolgreich"});

}catch(err){

console.error(err);
res.status(500).json({message:"Serverfehler"});

}

});

/* =====================================================
SPIELER AN SPIEL VERKAUFEN
===================================================== */

router.post("/sell-player", auth, async (req,res)=>{

try{

const { playerId } = req.body;

const player = await Player.findById(playerId);

if(!player){
return res.status(404).json({message:"Spieler nicht gefunden"});
}

const team = await Team.findOne({
owner:req.user.userId
});

if(!team){
return res.status(404).json({message:"Kein Team"});
}

if(player.team.toString() !== team._id.toString()){
return res.status(403).json({message:"Nicht dein Spieler"});
}

/* Verkaufspreis = 80% Marktwert */

const price = Math.floor(player.marketValue * 0.8);

/* Geld */

team.balance += price;

/* Spieler entfernen */

await Player.deleteOne({ _id: player._id });

await team.save();

res.json({
message:"Spieler an Spiel verkauft",
price
});

}catch(err){

console.error(err);
res.status(500).json({message:"Serverfehler"});

}

});

/* =====================================================
SCOUT KAUFEN
===================================================== */

router.post("/buy-scout", auth, async (req,res)=>{

try{

const { scoutId } = req.body;

const scout = await Scout.findById(scoutId);

if(!scout || !scout.isListed){
return res.status(404).json({message:"Scout nicht verfügbar"});
}

const team = await Team.findOne({
owner:req.user.userId
});

if(team.balance < scout.transferPrice){
return res.status(400).json({message:"Zu wenig Geld"});
}

if(team.scouts.length >= team.scoutSlots){
return res.status(400).json({message:"Scout Slots voll"});
}

/* Geld */

team.balance -= scout.transferPrice;

/* Scout */

scout.team = team._id;
scout.isListed = false;

team.scouts.push(scout._id);

await scout.save();
await team.save();

res.json({message:"Scout verpflichtet"});

}catch(err){

console.error(err);
res.status(500).json({message:"Serverfehler"});

}

});

/* =====================================================
COACH KAUFEN
===================================================== */

router.post("/buy-coach", auth, async (req,res)=>{

try{

const { coachId } = req.body;

const coach = await Coach.findById(coachId);

if(!coach || !coach.isListed){
return res.status(404).json({message:"Trainer nicht verfügbar"});
}

const team = await Team.findOne({
owner:req.user.userId
});

if(team.balance < coach.transferPrice){
return res.status(400).json({message:"Zu wenig Geld"});
}

/* Geld */

team.balance -= coach.transferPrice;

/* Trainer */

coach.team = team._id;
coach.isListed = false;

team.coach = coach._id;

await coach.save();
await team.save();

res.json({message:"Trainer verpflichtet"});

}catch(err){

console.error(err);
res.status(500).json({message:"Serverfehler"});

}

});

module.exports = router;