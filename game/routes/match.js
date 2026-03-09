const express = require("express");
const router = express.Router();

const Match = require("../models/Match");
const Team = require("../models/Team");
const Player = require("../models/Player");
const Manager = require("../models/Manager");

const auth = require("../middleware/auth");

const { simulateMatch } = require("../engines/matchEngine");

/* ======================================================
 CHECK IF USER HAS NEW MATCH RESULT
====================================================== */

router.get("/has-new", auth, async (req, res) => {

try {

const team = await Team.findOne({ owner: req.user.userId });

if (!team) {
return res.json({ hasNew:false });
}

const match = await Match.findOne({
$or: [
{ homeTeam: team._id },
{ awayTeam: team._id }
],
played: true
});

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
});

if(!team){
return res.status(404).json([]);
}

const year = parseInt(req.query.year);
const month = parseInt(req.query.month);

const startDate = new Date(year, month, 1);
const endDate = new Date(year, month + 1, 1);

const matches = await Match.find({

$or:[
{ homeTeam: team._id },
{ awayTeam: team._id }
],

date:{
$gte:startDate,
$lt:endDate
}

})
.populate("homeTeam")
.populate("awayTeam")
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
.populate("homeTeam")
.populate("awayTeam");

if (!match) {
return res.status(404).json({
error: "Match nicht gefunden"
});
}

res.json(match);

} catch (err) {

console.error(err);

res.status(500).json({
error: "Serverfehler"
});

}

});


/* ======================================================
 SIMULATE MATCH
====================================================== */

router.post("/simulate/:id", auth, async (req, res) => {

try {

const match = await Match.findById(req.params.id);

if (!match) {
return res.status(404).json({
error: "Match nicht gefunden"
});
}

if (match.played) {
return res.status(400).json({
error: "Match wurde bereits gespielt"
});
}

/* Spieler laden */

const homePlayers = await Player.find({ team: match.homeTeam });
const awayPlayers = await Player.find({ team: match.awayTeam });

/* Manager laden */

const homeManager = await Manager.findOne({ team: match.homeTeam });
const awayManager = await Manager.findOne({ team: match.awayTeam });

if (!homeManager || !awayManager) {
return res.status(400).json({
error: "Manager fehlt"
});
}

/* Simulation */

const simulation = simulateMatch(

{
players: homePlayers,
manager: homeManager
},

{
players: awayPlayers,
manager: awayManager
}

);

/* Ergebnis speichern */

match.homeGoals = simulation.result.homeGoals;
match.awayGoals = simulation.result.awayGoals;

match.stats = simulation.stats;
match.events = simulation.events;

match.played = true;

await match.save();

res.json(match);

} catch (err) {

console.error("Simulation Fehler:", err);

res.status(500).json({
error: "Simulation fehlgeschlagen"
});

}

});

module.exports = router;