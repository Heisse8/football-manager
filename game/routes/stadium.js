const express = require("express");
const router = express.Router();

const Stadium = require("../models/Stadium");
const Team = require("../models/Team");

const auth = require("../middleware/auth");

/* =====================================================
EXPANSION CONFIG
===================================================== */

const expansionConfig = {

8000: { next: 12000, cost: 6000000, duration: 12 },
12000: { next: 16000, cost: 12000000, duration: 16 },
16000: { next: 24000, cost: 25000000, duration: 22 },
24000: { next: 32000, cost: 45000000, duration: 30 },
32000: { next: 48000, cost: 70000000, duration: 40 },
48000: { next: 64000, cost: 110000000, duration: 55 },
64000: { next: 80000, cost: 180000000, duration: 80 }

};

/* =====================================================
GET STADIUM
===================================================== */

router.get("/", auth, async (req,res)=>{

try{

const team = await Team.findOne({
owner:req.user.userId
}).lean();

if(!team){
return res.status(404).json({message:"Team nicht gefunden"});
}

const stadium = await Stadium.findOne({
team:team._id
}).lean();

if(!stadium){
return res.status(404).json({message:"Stadion nicht gefunden"});
}

/* ================= PROGRESS ================= */

let progress = 0;
let remainingTime = null;

if(stadium.construction?.inProgress){

const now = Date.now();
const start = new Date(stadium.construction.startDate).getTime();
const finish = new Date(stadium.construction.finishDate).getTime();

const total = finish - start;
const elapsed = now - start;

progress = Math.min(100, Math.max(0, (elapsed / total) * 100));

const remainingMs = finish - now;

if(remainingMs > 0){

const weeks = Math.floor(remainingMs / (1000*60*60*24*7));
const days = Math.floor((remainingMs / (1000*60*60*24)) % 7);
const hours = Math.floor((remainingMs / (1000*60*60)) % 24);
const minutes = Math.floor((remainingMs / (1000*60)) % 60);

remainingTime = { weeks, days, hours, minutes };

}

}

/* ================= EXPANSION INFO ================= */

const nextExpansion = expansionConfig[stadium.capacity] || null;

res.json({

...stadium,
fanBase: team.fanBase,

progress,
remainingTime,
nextExpansion

});

}catch(err){

console.error("Get Stadium Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
SET STADIUM NAME (1x)
===================================================== */

router.put("/set-name", auth, async (req,res)=>{

try{

const { name } = req.body;

if(!name || name.trim().length < 3 || name.length > 30){
return res.status(400).json({
message:"Ungültiger Stadionname"
});
}

const team = await Team.findOne({ owner:req.user.userId });

if(!team){
return res.status(404).json({message:"Team nicht gefunden"});
}

const stadium = await Stadium.findOne({ team:team._id });

if(!stadium){
return res.status(404).json({message:"Stadion nicht gefunden"});
}

if(stadium.nameLocked){
return res.status(400).json({
message:"Stadionname kann nur einmal geändert werden"
});
}

stadium.name = name.trim();
stadium.nameLocked = true;

await stadium.save();

res.json(stadium);

}catch(err){

console.error("Set Stadium Name Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
SET TICKET PRICE
===================================================== */

router.put("/ticket-price", auth, async (req,res)=>{

try{

const { price } = req.body;

/* BUGFIX: vorher falsche Werte */

if(price < 5 || price > 100){
return res.status(400).json({
message:"Ticketpreis muss zwischen 5€ und 100€ liegen"
});
}

const team = await Team.findOne({ owner:req.user.userId });

if(!team){
return res.status(404).json({message:"Team nicht gefunden"});
}

const stadium = await Stadium.findOne({ team:team._id });

if(!stadium){
return res.status(404).json({
message:"Stadion nicht gefunden"
});
}

stadium.ticketPrice = price;

await stadium.save();

res.json(stadium);

}catch(err){

console.error("Ticketpreis Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
START EXPANSION
===================================================== */

router.post("/expand", auth, async (req,res)=>{

try{

const team = await Team.findOne({ owner:req.user.userId });

if(!team){
return res.status(404).json({message:"Team nicht gefunden"});
}

const stadium = await Stadium.findOne({ team:team._id });

if(!stadium){
return res.status(404).json({message:"Stadion nicht gefunden"});
}

if(stadium.construction?.inProgress){
return res.status(400).json({
message:"Stadion wird bereits ausgebaut"
});
}

const config = expansionConfig[stadium.capacity];

if(!config){
return res.status(400).json({
message:"Maximale Stadiongröße erreicht"
});
}

if(team.balance < config.cost){
return res.status(400).json({
message:"Nicht genug Geld"
});
}

/* ================= GELD ================= */

team.balance -= config.cost;
await team.save();

/* ================= BAUZEIT ================= */

const startDate = new Date();

const finishDate = new Date(
startDate.getTime() + config.duration * 7 * 24 * 60 * 60 * 1000
);

/* ================= CONSTRUCTION ================= */

stadium.construction = {

inProgress:true,
targetCapacity:config.next,
startDate,
finishDate

};

await stadium.save();

res.json({

success:true,
targetCapacity:config.next,
cost:config.cost,
duration:config.duration

});

}catch(err){

console.error("Stadium Expand Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
CHECK CONSTRUCTION
===================================================== */

router.post("/check-construction", auth, async (req,res)=>{

try{

const team = await Team.findOne({ owner:req.user.userId });

if(!team){
return res.status(404).json({message:"Team nicht gefunden"});
}

const stadium = await Stadium.findOne({ team:team._id });

if(!stadium){
return res.status(404).json({message:"Stadion nicht gefunden"});
}

if(
stadium.construction?.inProgress &&
new Date() >= new Date(stadium.construction.finishDate)
){

stadium.capacity = stadium.construction.targetCapacity;

stadium.construction = {

inProgress:false,
targetCapacity:null,
startDate:null,
finishDate:null

};

await stadium.save();

}

res.json(stadium);

}catch(err){

console.error("Check Construction Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

module.exports = router;