const express = require("express");
const router = express.Router();

const Transfer = require("../models/Transfer");
const Player = require("../models/Player");
const Manager = require("../models/Manager");
const Scout = require("../models/Scout");
const Team = require("../models/Team");

const auth = require("../middleware/auth");

/* =====================================================
 ITEM AUF TRANSFERMARKT SETZEN
===================================================== */

router.post("/list", auth, async (req,res)=>{

try{

const { itemId, type, price } = req.body;

const team = await Team.findOne({
owner:req.user.userId
});

if(!team){
return res.status(404).json({
message:"Team nicht gefunden"
});
}

let item;

/* ITEM LADEN */

if(type === "player"){
item = await Player.findById(itemId);
}

if(type === "manager"){
item = await Manager.findById(itemId);
}

if(type === "scout"){
item = await Scout.findById(itemId);
}

if(!item){
return res.status(404).json({
message:"Item nicht gefunden"
});
}

/* BESITZ PRÜFEN */

if(item.team && item.team.toString() !== team._id.toString()){

return res.status(400).json({
message:"Gehört nicht deinem Team"
});

}

/* AUKTIONSENDE */

const end = new Date();
end.setHours(end.getHours() + 24);

/* TRANSFER ERSTELLEN */

const transfer = await Transfer.create({

type,
item:item._id,

seller:team._id,

startPrice:price,
currentBid:price,

status:"active",

expiresAt:end

});

res.json(transfer);

}catch(err){

console.error(err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
 GEBOT ABGEBEN
===================================================== */

router.post("/bid", auth, async (req,res)=>{

try{

const { transferId, amount } = req.body;

const team = await Team.findOne({
owner:req.user.userId
});

if(!team){
return res.status(404).json({
message:"Team nicht gefunden"
});
}

const transfer = await Transfer.findById(transferId);

if(!transfer || transfer.status !== "active"){

return res.status(400).json({
message:"Transfer beendet"
});

}

/* MINDESTGEBOT */

if(amount <= transfer.currentBid){

return res.status(400).json({
message:"Gebot zu niedrig"
});

}

/* GELD PRÜFEN */

if(team.balance < amount){

return res.status(400).json({
message:"Nicht genug Geld"
});

}

/* GEBOT SETZEN */

transfer.currentBid = amount;
transfer.highestBidder = team._id;

await transfer.save();

res.json({
success:true
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
 TRANSFERS NACH KATEGORIE
===================================================== */

router.get("/:type", async (req,res)=>{

try{

const { type } = req.params;

const transfers = await Transfer.find({

type,
status:"active"

}).populate("item");

res.json(transfers);

}catch(err){

console.error(err);

res.status(500).json({
message:"Serverfehler"
});

}

});

module.exports = router;