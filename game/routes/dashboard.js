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

/* =====================================================
TEAM
===================================================== */

const team = await Team.findOne({
owner:req.user.userId
});

if(!team){
return res.status(404).json({
message:"Kein Team gefunden"
});
}

/* =====================================================
LEAGUE TABLE
===================================================== */

const league = await Team.find({
league:team.league
})
.sort({
points:-1,
goalDifference:-1,
goalsFor:-1
});

/* =====================================================
NEXT MATCHES
===================================================== */

const matches = await Match.find({

$or:[
{homeTeam:team._id},
{awayTeam:team._id}
],

played:false

})
.populate("homeTeam")
.populate("awayTeam")
.sort({date:1})
.limit(2);

const nextMatch = matches[0] || null;
const nextMatch2 = matches[1] || null;

/* =====================================================
NEWS
===================================================== */

let news = [];

try{

news = await News.find({
league:team.league
})
.sort({createdAt:-1})
.limit(5);

}catch{

news = [];

}

/* =====================================================
TOP SCORERS
===================================================== */

let topScorers = [];

try{

topScorers = await Player.find({
league:team.league
})
.sort({"seasonStats.goals":-1})
.limit(5);

}catch{
topScorers = [];
}

/* =====================================================
TEAM FORM (LAST 5 MATCHES)
===================================================== */

let teamForm = [];

try{

teamForm = await Match.find({

$or:[
{homeTeam:team._id},
{awayTeam:team._id}
],

played:true

})
.sort({date:-1})
.limit(5)
.populate("homeTeam")
.populate("awayTeam");

}catch{

teamForm = [];

}

/* =====================================================
STADIUM
===================================================== */

let stadium = null;

try{

stadium = await Stadium.findOne({
team:team._id
});

}catch{

stadium = null;

}

/* =====================================================
PLAYER OF MONTH
===================================================== */

let playerOfMonth = null;

try{

playerOfMonth = await Player.findOne({
team:team._id
})
.sort({"seasonStats.rating":-1});

}catch{

playerOfMonth = null;

}

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