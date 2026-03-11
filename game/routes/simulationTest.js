const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const { simulateRealisticMatch } = require("../engine/matchEngine");

router.get("/:count", async (req,res)=>{

try{

const count = parseInt(req.params.count) || 100;

const teams = await Team.find().limit(2);

if(teams.length < 2){
return res.status(400).json({ message:"Nicht genug Teams" });
}

let totalGoals = 0;
let totalXG = 0;
let totalShots = 0;

for(let i=0;i<count;i++){

const result = await simulateRealisticMatch({
homeTeam:teams[0],
awayTeam:teams[1]
});

totalGoals += result.result.homeGoals + result.result.awayGoals;

totalXG += result.xG.home + result.xG.away;

totalShots +=
result.stats.shots.home +
result.stats.shots.away;

}

res.json({

games:count,

averageGoals:(totalGoals/count).toFixed(2),

averageXG:(totalXG/count).toFixed(2),

averageShots:(totalShots/count).toFixed(2)

});

}catch(err){

console.error(err);
res.status(500).json({ message:"Simulation Fehler" });

}

});

module.exports = router;