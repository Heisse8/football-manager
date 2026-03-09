const Team = require("../models/Team");
const Match = require("../models/Match");

/* =====================================================
UTIL SHUFFLE
===================================================== */

function shuffle(array){

for(let i=array.length-1;i>0;i--){

const j=Math.floor(Math.random()*(i+1));

[array[i],array[j]]=[array[j],array[i]];

}

return array;

}

/* =====================================================
ERSTE POKALRUNDE
36 TEAMS → 4 FREILOSE → 32 SPIELEN
===================================================== */

async function generateCupFirstRound(country){

const liga1 = await Team.find({ league:`${country}_1` });
const liga2 = await Team.find({ league:`${country}_2` });

let teams = [...liga1, ...liga2];

if(teams.length < 36){

console.log("Zu wenige Teams für Pokal:", teams.length);
return;

}

teams = shuffle(teams);

/* 4 Freilose */

const byeTeams = teams.slice(0,4);

/* restliche 32 */

const roundTeams = teams.slice(4);

const date = getNextThursday();

let matches=[];

/* Spiele */

for(let i=0;i<roundTeams.length;i+=2){

matches.push({

homeTeam:roundTeams[i]._id,
awayTeam:roundTeams[i+1]._id,

competition:"cup",
country,
cupRound:"runde1",

date,
played:false

});

}

/* Freilose */

for(const team of byeTeams){

matches.push({

homeTeam:team._id,
awayTeam:null,

competition:"cup",
country,
cupRound:"freilos",

date:null,
played:true

});

}

await Match.insertMany(matches);

console.log(`${country} Pokal Runde 1 erstellt`);

}

/* =====================================================
NÄCHSTE RUNDE
===================================================== */

async function drawNextCupRound(country,round){

const finishedMatches = await Match.find({

competition:"cup",
country,
cupRound:round,
played:true

});

let winners=[];

for(const match of finishedMatches){

if(!match.awayTeam){

winners.push(match.homeTeam);
continue;

}

if(match.homeGoals > match.awayGoals){
winners.push(match.homeTeam);
}else{
winners.push(match.awayTeam);
}

}

/* Sieger */

if(winners.length === 1){

console.log("🏆 Pokalsieger:", winners[0]);
return;

}

winners = shuffle(winners);

const nextRound = getNextRound(round);

const date = getNextThursday();

let matches=[];

for(let i=0;i<winners.length;i+=2){

if(!winners[i+1]) break;

matches.push({

homeTeam:winners[i],
awayTeam:winners[i+1],

competition:"cup",
country,
cupRound:nextRound,

date,
played:false

});

}

await Match.insertMany(matches);

console.log(`Neue Pokalrunde erstellt: ${nextRound}`);

}

/* =====================================================
RUNDE LOGIK
===================================================== */

function getNextRound(round){

if(round === "runde1") return "achtelfinale";
if(round === "achtelfinale") return "viertelfinale";
if(round === "viertelfinale") return "halbfinale";
if(round === "halbfinale") return "finale";

return null;

}

/* =====================================================
NÄCHSTER DONNERSTAG
===================================================== */

function getNextThursday(){

const now=new Date();

const day=now.getDay();

const diff=(4-day+7)%7 || 7;

now.setDate(now.getDate()+diff);

return now;

}

module.exports = {
generateCupFirstRound,
drawNextCupRound
};