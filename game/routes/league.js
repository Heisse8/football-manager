const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const Season = require("../models/Season");
const Match = require("../models/Match");

const generateSchedule = require("../utils/scheduleGenerator");

/* =====================================================
SPIELPLAN GENERIEREN
POST /api/league/:league/generate
===================================================== */

router.post("/:league/generate", async (req,res)=>{

try{

const { league } = req.params;

const teams = await Team.find({ league });

if(teams.length !== 18){

return res.status(400).json({
message:"Liga muss genau 18 Teams haben."
});

}

const existingSeason = await Season.findOne({ league });

if(existingSeason && existingSeason.isGenerated){

return res.status(400).json({
message:"Spielplan bereits generiert."
});

}

const seasonStart = new Date();

/* Spielplan erstellen */

await generateSchedule(teams, league, seasonStart);

/* Season speichern */

if(!existingSeason){

await Season.create({
league,
seasonStart,
isGenerated:true
});

}else{

existingSeason.isGenerated = true;
await existingSeason.save();

}

res.json({
message:"Spielplan erfolgreich generiert."
});

}catch(err){

console.error(err);
res.status(500).json({message:"Serverfehler"});

}

});


/* =====================================================
LIGATABELLE
GET /api/league/table/:league
===================================================== */

router.get("/table/:league", async (req,res)=>{

try{

const { league } = req.params;

const table = await Team.find({ league })
.sort({
points:-1,
goalDifference:-1,
goalsFor:-1
});

res.json(table);

}catch(err){

console.error(err);

res.status(500).json({
message:"Serverfehler"
});

}

});


/* =====================================================
SPIELPLAN DER LIGA
GET /api/league/schedule/:league
===================================================== */

router.get("/schedule/:league", async (req,res)=>{

try{

const { league } = req.params;

const matches = await Match.find({ league })
.populate("homeTeam","name")
.populate("awayTeam","name")
.sort({ date:1 });

res.json(matches);

}catch(err){

console.error(err);

res.status(500).json({
message:"Serverfehler"
});

}

});


/* =====================================================
AKTUELLER SPIELTAG
GET /api/league/matchday/:league
===================================================== */

router.get("/matchday/:league", async (req,res)=>{

try{

const { league } = req.params;

const matchday = await Match.aggregate([
{ $match:{ league } },
{ $group:{ _id:null, maxMatchday:{ $max:"$matchday" } } }
]);

res.json({
matchday: matchday[0]?.maxMatchday || 1
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Serverfehler"
});

}

});


module.exports = router;