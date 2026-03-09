const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const Season = require("../models/Season");
const Match = require("../models/Match");

const { generateLeagueSchedule } = require("../utils/scheduleGenerator");

const auth = require("../middleware/auth");

/* =====================================================
SPIELPLAN GENERIEREN
POST /api/league/:league/generate
===================================================== */

router.post("/:league/generate", auth, async (req,res)=>{

try{

const { league } = req.params;

/* ================= TEAMS LADEN ================= */

const teams = await Team.find({ league });

if(teams.length !== 18){

return res.status(400).json({
message:"Liga muss genau 18 Teams haben."
});

}

/* ================= SAISON PRÜFEN ================= */

let existingSeason = await Season.findOne({ league });

if(existingSeason && existingSeason.isGenerated){

return res.status(400).json({
message:"Spielplan bereits generiert."
});

}

const seasonStart = new Date();

/* ================= SPIELPLAN ERSTELLEN ================= */

await generateLeagueSchedule(teams, league, seasonStart);

/* ================= SEASON SPEICHERN ================= */

if(!existingSeason){

await Season.create({
league,
seasonStart,
isGenerated:true
});

}else{

existingSeason.isGenerated = true;
existingSeason.seasonStart = seasonStart;

await existingSeason.save();

}

res.json({
message:"Spielplan erfolgreich generiert."
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Serverfehler"
});

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
.select("name shortName points wins draws losses goalsFor goalsAgainst goalDifference tablePosition")
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
.populate("homeTeam","name shortName")
.populate("awayTeam","name shortName")
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

/* ================= MAX MATCHDAY ================= */

const result = await Match.aggregate([

{ $match:{ league } },

{
$group:{
_id:null,
maxMatchday:{ $max:"$matchday" }
}
}

]);

const matchday = result[0]?.maxMatchday || 1;

res.json({ matchday });

}catch(err){

console.error(err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
SPIELE EINES SPIELTAGS
GET /api/league/matchday/:league/:matchday
===================================================== */

router.get("/matchday/:league/:matchday", async (req,res)=>{

try{

const { league, matchday } = req.params;

const matches = await Match.find({

league,
matchday:Number(matchday)

})
.populate("homeTeam","name shortName")
.populate("awayTeam","name shortName")
.sort({ date:1 });

res.json(matches);

}catch(err){

console.error(err);

res.status(500).json({
message:"Serverfehler"
});

}

});

module.exports = router;