const Match = require("../models/Match");

function shuffle(arr){
return arr.sort(()=>Math.random()-0.5);
}

async function generateCupRound(teams, country, round, date){

const shuffled = shuffle(teams);

for(let i=0;i<shuffled.length;i+=2){

await Match.create({

homeTeam: shuffled[i]._id,
awayTeam: shuffled[i+1]._id,

competition:"cup",

round,

date,
played:false

});

}

}

module.exports = { generateCupRound };