const Team = require("../models/Team");
const Match = require("../models/Match");

/* =====================================================
UTIL SHUFFLE
===================================================== */

function shuffle(array){

for(let i = array.length - 1; i > 0; i--){

const j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]];

}

return array;

}

/* =====================================================
ERSTE POKALRUNDE GENERIEREN
36 TEAMS → 4 FREILOSE → 32 SPIELEN
===================================================== */

async function generateCupFirstRound(country){

const liga1 = await Team.find({ league:`${country}_1` });
const liga2 = await Team.find({ league:`${country}_2` });

let teams = [...liga1, ...liga2];

/* Sicherheit */

if(teams.length < 36){
console.log("Zu wenige Teams für Pokal:", teams.length);
return;
}

/* Teams mischen */

teams = shuffle(teams);

/* 4 Freilose */

const byeTeams = teams.slice(0,4);

/* restliche 32 Teams */

const roundTeams = teams.slice(4);

/* Datum */

const date = getNextThursday();

/* Spiele erstellen */

for(let i=0;i<roundTeams.length;i+=2){

await Match.create({

homeTeam:roundTeams[i]._id,
awayTeam:roundTeams[i+1]._id,

competition:"cup",
cupRound:"runde1",

date,
played:false

});

}

/* Freilose Teams */

for(const team of byeTeams){

await Match.create({

homeTeam:team._id,
awayTeam:null,

competition:"cup",
cupRound:"freilos",

date:null,
played:true

});

}

console.log(`${country} Pokal Runde 1 erstellt (4 Freilose)`);

}

/* =====================================================
NÄCHSTE RUNDE AUSLOSEN
===================================================== */

async function drawNextCupRound(country, round){

const finishedMatches = await Match.find({
competition:"cup",
cupRound:round,
played:true
});

let winners = [];

for(const match of finishedMatches){

if(!match.awayTeam){

/* Freilos */

winners.push(match.homeTeam);

continue;

}

if(match.homeGoals > match.awayGoals){
winners.push(match.homeTeam);
}else{
winners.push(match.awayTeam);
}

}

/* Finale erreicht */

if(winners.length === 1){
console.log("Pokal Sieger:", winners[0]);
return;
}

/* Teams mischen */

winners = shuffle(winners);

/* neue Paarungen */

const nextRound = getNextRound(round);

const date = getNextThursday();

for(let i=0;i<winners.length;i+=2){

if(!winners[i+1]) break;

await Match.create({

homeTeam:winners[i],
awayTeam:winners[i+1],

competition:"cup",
cupRound:nextRound,

date,
played:false

});

}

console.log(`Neue Pokalrunde erstellt: ${nextRound}`);

}

/* =====================================================
NÄCHSTE RUNDE
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

const now = new Date();

const day = now.getDay();

const diff = (4 - day + 7) % 7 || 7;

now.setDate(now.getDate() + diff);

return now;

}

/* =====================================================
EXPORT
===================================================== */

module.exports = {
generateCupFirstRound,
drawNextCupRound
};