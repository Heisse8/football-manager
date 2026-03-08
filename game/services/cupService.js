const Team = require("../models/Team");
const Match = require("../models/Match");

function shuffle(arr){
return arr.sort(()=>Math.random()-0.5);
}

async function generateCupFirstRound(country){

const liga1 = await Team.find({ league:`${country}_1` });
const liga2 = await Team.find({ league:`${country}_2` });

let teams = [...liga1,...liga2];

/* nur 32 Teams */

teams = shuffle(teams).slice(0,32);

const date = getNextThursday();

for(let i=0;i<teams.length;i+=2){

await Match.create({

homeTeam:teams[i]._id,
awayTeam:teams[i+1]._id,

competition:"cup",
cupRound:"runde1",

date,
played:false

});

}

}

function getNextThursday(){

const now = new Date();

const day = now.getDay();

const diff = (4 - day + 7) % 7;

now.setDate(now.getDate()+diff);

return now;

}

module.exports = { generateCupFirstRound };