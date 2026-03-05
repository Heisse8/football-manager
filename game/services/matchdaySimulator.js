const Match = require("../models/Match");

const { simulateRealisticMatch } = require("./matchEngine");

/* =====================================================
SIMULATE MATCHDAY
===================================================== */

async function simulateMatchday(){

const today = new Date();

const matches = await Match.find({
played:false,
date:{ $lte: today }
})
.populate("homeTeam")
.populate("awayTeam");

console.log("Spiele gefunden:", matches.length);

for(const match of matches){

const result = await simulateRealisticMatch({
homeTeam: match.homeTeam,
awayTeam: match.awayTeam,
match
});

match.homeGoals = result.result.homeGoals;
match.awayGoals = result.result.awayGoals;

match.stats = result.stats;
match.events = result.events;
match.ratings = result.ratings;
match.xG = result.xG;

match.played = true;

await match.save();

console.log(
`${match.homeTeam.name} ${match.homeGoals}:${match.awayGoals} ${match.awayTeam.name}`
);

}

}

module.exports = { simulateMatchday };