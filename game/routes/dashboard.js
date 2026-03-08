const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const Match = require("../models/Match");
const News = require("../models/News");

const auth = require("../middleware/auth");

/* =====================================================
DASHBOARD DATA
===================================================== */

router.get("/", auth, async (req,res)=>{

try{

/* TEAM */

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
NEXT MATCH
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
.limit(1);

const nextMatch = matches[0] || null;

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
RETURN
===================================================== */

res.json({

team,
league,
nextMatch,
news

});

}catch(err){

console.error("Dashboard Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

module.exports = router;