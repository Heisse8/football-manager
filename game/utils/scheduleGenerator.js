const Match = require("../models/Match");

/*
=====================================
ROUND ROBIN SCHEDULE GENERATOR
=====================================
18 Teams
34 Matchdays
Hin + Rückrunde
Heim/Auswärts wechselt
=====================================
*/

async function generateLeagueSchedule(teams, league){

const teamIds = teams.map(t => t._id);

if(teamIds.length % 2 !== 0){
teamIds.push(null);
}

const rounds = teamIds.length - 1;
const matchesPerRound = teamIds.length / 2;

let rotation = [...teamIds];

let matchday = 1;
const matches = [];

/* ================================
HINRUNDE
================================ */

for(let round = 0; round < rounds; round++){

for(let i = 0; i < matchesPerRound; i++){

const teamA = rotation[i];
const teamB = rotation[rotation.length - 1 - i];

if(teamA && teamB){

const homeTeam = round % 2 === 0 ? teamA : teamB;
const awayTeam = round % 2 === 0 ? teamB : teamA;

matches.push({

league,
matchday,
homeTeam,
awayTeam,
played:false,
date: new Date(Date.now() + matchday * 86400000)

});

}

}

/* ROTATION */

rotation.splice(1,0,rotation.pop());

matchday++;

}

/* ================================
RÜCKRUNDE
================================ */

const firstHalf = [...matches];

for(const m of firstHalf){

matches.push({

league,
matchday:m.matchday + rounds,
homeTeam:m.awayTeam,
awayTeam:m.homeTeam,
played:false,
date:new Date()

});

}

/* ================================
SAVE MATCHES
================================ */

await Match.insertMany(matches);

console.log("Spielplan erstellt:", matches.length, "Spiele");

}

module.exports = { generateLeagueSchedule };