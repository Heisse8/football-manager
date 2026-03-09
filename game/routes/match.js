const express = require("express");
const router = express.Router();

const Match = require("../models/Match");
const Team = require("../models/Team");
const Player = require("../models/Player");
const Manager = require("../models/Manager");

const auth = require("../middleware/auth");

const { simulateMatch } = require("../engines/matchEngine");
const { updateLeagueTable, updateScorers } = require("../utils/updateLeagueTable");

/* ======================================================
CHECK IF USER HAS NEW MATCH RESULT
====================================================== */

router.get("/has-new", auth, async (req, res) => {

try {

const team = await Team.findOne({ owner: req.user.userId }).select("_id");

if (!team) {
return res.json({ hasNew:false });
}

const match = await Match.findOne({
$or:[
{ homeTeam:team._id },
{ awayTeam:team._id }
],
played:true
})
.sort({ date:-1 })
.select("_id");

res.json({ hasNew: !!match });

} catch (err) {

console.error("Has-New Fehler:", err);
res.json({ hasNew:false });

}

});

/* ======================================================
GET MATCHES FOR CURRENT USER (MONTH VIEW)
====================================================== */

router.get("/my-month", auth, async (req,res)=>{

try{

const team = await Team.findOne({
owner:req.user.userId
}).select("_id");

if(!team){
return res.json([]);
}

const year = parseInt(req.query.year);
const month = parseInt(req.query.month);

const startDate = new Date(year, month, 1);
const endDate = new Date(year, month + 1, 1);

const matches = await Match.find({

$or:[
{ homeTeam:team._id },
{ awayTeam:team._id }
],

date:{
$gte:startDate,
$lt:endDate
}

})
.populate("homeTeam","name shortName")
.populate("awayTeam","name shortName")
.sort({ date:1 });

res.json(matches);

}catch(err){

console.error("Kalender Fehler:",err);
res.status(500).json([]);

}

});

/* ======================================================
GET MATCH BY ID
====================================================== */

router.get("/:id", async (req, res) => {

try {

const match = await Match.findById(req.params.id)
.populate("homeTeam","name shortName")
.populate("awayTeam","name shortName");

if (!match) {
return res.status(404).json({
error:"Match nicht gefunden"
});
}

res.json(match);

} catch (err) {

console.error("Match laden Fehler:", err);

res.status(500).json({
error:"Serverfehler"
});

}

});

/* ======================================================
SIMULATE MATCH
====================================================== */

router.post("/simulate/:id", auth, async (req, res) => {

try {

/* ================= MATCH + TEAM ================= */

const [match, team] = await Promise.all([

Match.findById(req.params.id),

Team.findOne({ owner:req.user.userId })

]);

if (!match) {
return res.status(404).json({
error:"Match nicht gefunden"
});
}

if (!team) {
return res.status(403).json({
error:"Kein Team"
});
}

/* Sicherheitscheck */

if(
match.homeTeam.toString() !== team._id.toString() &&
match.awayTeam.toString() !== team._id.toString()
){
return res.status(403).json({
error:"Match gehört nicht zu deinem Team"
});
}

if (match.played) {
return res.status(400).json({
error:"Match wurde bereits gespielt"
});
}

/* ================= SPIELER + MANAGER ================= */

const [

homePlayers,
awayPlayers,
homeManager,
awayManager

] = await Promise.all([

Player.find({ team:match.homeTeam }),

Player.find({ team:match.awayTeam }),

Manager.findOne({ team:match.homeTeam }),

Manager.findOne({ team:match.awayTeam })

]);

if (!homeManager || !awayManager) {
return res.status(400).json({
error:"Manager fehlt"
});
}

/* ================= MATCH SIMULATION ================= */

const simulation = simulateMatch(

{
players:homePlayers,
manager:homeManager
},

{
players:awayPlayers,
manager:awayManager
}

);

/* ================= ERGEBNIS ================= */

match.homeGoals = simulation.result.homeGoals;
match.awayGoals = simulation.result.awayGoals;

match.stats = simulation.stats;
match.events = simulation.events;

match.played = true;

await match.save();

/* ================= TABLE + SCORER ================= */

await Promise.all([

updateLeagueTable(match),
updateScorers(match)

]);

res.json(match);

} catch (err) {

console.error("Simulation Fehler:", err);

res.status(500).json({
error:"Simulation fehlgeschlagen"
});

}

});

module.exports = router;