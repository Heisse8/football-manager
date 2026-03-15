const cron = require("node-cron");

const Match = require("../models/Match");
const Team = require("../models/Team");

/* =====================================================
COMPETITION CRON
===================================================== */

function startCompetitionCron(){

/* =========================================
DIENSTAG → LIGA
========================================= */

cron.schedule("0 4 * * 2", async ()=>{

console.log("⚽ Liga Spieltag (Dienstag)");

try{

await simulateLeagueMatches();

}catch(err){

console.error("Liga Cron Fehler:", err);

}

});

/* =========================================
SAMSTAG → LIGA
========================================= */

cron.schedule("0 4 * * 6", async ()=>{

console.log("⚽ Liga Spieltag (Samstag)");

try{

await simulateLeagueMatches();

}catch(err){

console.error("Liga Cron Fehler:", err);

}

});

/* =========================================
DONNERSTAG → CUP + CHAMPIONS LEAGUE
========================================= */

cron.schedule("0 4 * * 4", async ()=>{

console.log("🏆 Pokal / Champions League");

try{

await simulateCupMatches();
await simulateChampionsLeagueMatches();

}catch(err){

console.error("Competition Cron Fehler:", err);

}

});

}

/* =====================================================
LIGA SPIELE
===================================================== */

async function simulateLeagueMatches(){

const matches = await Match.find({
competition:"league",
played:false,
date:{ $lte:new Date() }
})
.populate("homeTeam")
.populate("awayTeam");

for(const match of matches){

await simulateSingleMatch(match);

}

}

/* =====================================================
POKALSPIELE
===================================================== */

async function simulateCupMatches(){

const matches = await Match.find({
competition:"cup",
played:false,
date:{ $lte:new Date() }
})
.populate("homeTeam")
.populate("awayTeam");

for(const match of matches){

await simulateSingleMatch(match,true);

}

}

/* =====================================================
CHAMPIONS LEAGUE
===================================================== */

async function simulateChampionsLeagueMatches(){

const matches = await Match.find({
competition:"ucl",
played:false,
date:{ $lte:new Date() }
})
.populate("homeTeam")
.populate("awayTeam");

for(const match of matches){

await simulateSingleMatch(match,true);

}

}

/* =====================================================
MATCH SIMULATION
===================================================== */

async function simulateSingleMatch(match, knockout=false){

try{

/* Ergebnis */

match.homeGoals = result.result.homeGoals;
match.awayGoals = result.result.awayGoals;

match.stats = result.stats;
match.events = result.events;
match.ratings = result.ratings;
match.xG = result.xG;

/* =====================================
VERLÄNGERUNG + ELFERSCHIESSEN
===================================== */

if(knockout && match.homeGoals === match.awayGoals){

match.extraTime = { played:true };

const extraHome = Math.floor(Math.random()*2);
const extraAway = Math.floor(Math.random()*2);

match.homeGoals += extraHome;
match.awayGoals += extraAway;

if(match.homeGoals === match.awayGoals){

match.penalties = { played:true };

if(Math.random() > 0.5){

match.homeGoals += 1;

}else{

match.awayGoals += 1;

}

}

}

/* =====================================
MATCH FINALISIEREN
===================================== */

match.played = true;
match.status = "finished";

await match.save();

/* =====================================
TABELLEN UPDATE (nur Liga)
===================================== */

if(match.competition === "league"){

await updateLeague(match);

}

console.log(
`${match.homeTeam.name} ${match.homeGoals}:${match.awayGoals} ${match.awayTeam.name}`
);

}catch(err){

console.error("Match Simulation Fehler:", err);

}

}

/* =====================================================
LIGA TABELLE UPDATE
===================================================== */

async function updateLeague(match){

const home = await Team.findById(match.homeTeam._id);
const away = await Team.findById(match.awayTeam._id);

/* Spiele */

home.played += 1;
away.played += 1;

/* Tore */

home.goalsFor += match.homeGoals;
home.goalsAgainst += match.awayGoals;

away.goalsFor += match.awayGoals;
away.goalsAgainst += match.homeGoals;

/* Torverhältnis */

home.goalDifference = home.goalsFor - home.goalsAgainst;
away.goalDifference = away.goalsFor - away.goalsAgainst;

/* Punkte */

if(match.homeGoals > match.awayGoals){

home.wins += 1;
away.losses += 1;

home.points += 3;

}else if(match.homeGoals < match.awayGoals){

away.wins += 1;
home.losses += 1;

away.points += 3;

}else{

home.draws += 1;
away.draws += 1;

home.points += 1;
away.points += 1;

}

await home.save();
await away.save();

}

/* =====================================================
EXPORT
===================================================== */

module.exports = { startCompetitionCron };