const Match = require("../models/Match");

async function generateLeagueSchedule(teams, league){

const DAY = 86400000;
const MATCH_INTERVAL = 3 * DAY;

const teamIds = teams.map(t => t._id);

if(teamIds.length % 2 !== 0){
teamIds.push(null);
}

const rounds = teamIds.length - 1;
const matchesPerRound = teamIds.length / 2;

let rotation = [...teamIds];

let matchday = 1;
const matches = [];

/* ================= HINRUNDE ================= */

for(let round = 0; round < rounds; round++){

for(let i = 0; i < matchesPerRound; i++){

const teamA = rotation[i];
const teamB = rotation[rotation.length - 1 - i];

if(teamA && teamB){

const homeTeam = i % 2 === 0 ? teamA : teamB;
const awayTeam = i % 2 === 0 ? teamB : teamA;

matches.push({

league,
matchday,
homeTeam,
awayTeam,
played:false,
date: new Date(Date.now() + matchday * MATCH_INTERVAL)

});

}

}

/* Rotation */

rotation.splice(1,0,rotation.pop());

matchday++;

}

/* ================= RÜCKRUNDE ================= */

const firstHalf = [...matches];

for(const m of firstHalf){

matches.push({

league,
matchday: m.matchday + rounds,
homeTeam: m.awayTeam,
awayTeam: m.homeTeam,
played:false,
date: new Date(Date.now() + (m.matchday + rounds) * MATCH_INTERVAL)

});

}

/* ================= SAVE ================= */

await Match.insertMany(matches);

console.log("Spielplan erstellt:", matches.length, "Spiele");

}

module.exports = { generateLeagueSchedule };