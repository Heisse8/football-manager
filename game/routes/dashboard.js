const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const Match = require("../models/Match");
const News = require("../models/News");
const Player = require("../models/Player");
const Stadium = require("../models/Stadium");

const auth = require("../middleware/auth");

/* =====================================================
DASHBOARD DATA
===================================================== */

router.get("/", auth, async (req,res)=>{

try{

/* ================= TEAM ================= */

const team = await Team.findOne({
owner:req.user.userId
});

if(!team){
return res.status(404).json({
message:"Kein Team gefunden"
});
}

/* =====================================================
ALLE QUERIES PARALLEL
===================================================== */

const [
league,
matches,
news,
teamForm,
stadium,
playerOfMonth
] = await Promise.all([

/* ================= LEAGUE TABLE ================= */

Team.find({
league:team.league
})
.select("name points goalDifference goalsFor tablePosition _id")
.sort({
points:-1,
goalDifference:-1,
goalsFor:-1
}),

/* ================= NEXT MATCHES ================= */

Match.find({

$or:[
{homeTeam:team._id},
{awayTeam:team._id}
],

played:false

})
.populate("homeTeam","name shortName")
.populate("awayTeam","name shortName")
.sort({date:1})
.limit(2),

/* ================= NEWS ================= */

News.find({
league:team.league
})
.sort({createdAt:-1})
.limit(5),

/* ================= TEAM FORM ================= */

Match.find({

$or:[
{homeTeam:team._id},
{awayTeam:team._id}
],

played:true

})
.sort({date:-1})
.limit(5)
.populate("homeTeam","name")
.populate("awayTeam","name"),

/* ================= STADIUM ================= */

Stadium.findOne({
team:team._id
}),

/* ================= PLAYER OF MONTH ================= */

Player.findOne({
team:team._id
})
.sort({"seasonStats.rating":-1})
.select("firstName lastName seasonStats")

]);

/* =====================================================
TOP SCORERS
===================================================== */

const leagueTeamIds = league.map(t => t._id);

const topScorers = await Player.find({
team:{ $in: leagueTeamIds }
})
.select("firstName lastName seasonStats team")
.sort({"seasonStats.goals":-1})
.limit(5);

/* =====================================================
NEXT MATCHES
===================================================== */

const nextMatch = matches[0] || null;
const nextMatch2 = matches[1] || null;

/* =====================================================
FINANCE
===================================================== */

const finance = {

balance: team.balance || 0,
lastRevenue: team.lastMatchRevenue || 0

};

/* =====================================================
RETURN
===================================================== */

res.json({

team,
league,

nextMatch,
nextMatch2,

news,

topScorers,
teamForm,

stadium,

playerOfMonth,

finance

});

}catch(err){

console.error("Dashboard Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

module.exports = router;