const Team = require("../models/Team");
const Match = require("../models/Match");
const Player = require("../models/Player");

const { generateLeagueSchedule } = require("../utils/scheduleGenerator");

const { processPlayerDevelopment } = require("./playerDevelopmentService");
const { processPlayerRetirements } = require("./playerRetirementService");
const { updateMarketValues } = require("./marketValueService");

/* =====================================================
SAISON ENDE
===================================================== */

async function processSeasonEnd(){

const countries = ["GER","ENG","ESP","ITA","FRA"];

for(const c of countries){

const liga1 = `${c}_1`;
const liga2 = `${c}_2`;

/* Tabellen holen */

const table1 = await Team.find({ league: liga1 })
.sort({ points:-1, goalDifference:-1, goalsFor:-1 });

const table2 = await Team.find({ league: liga2 })
.sort({ points:-1, goalDifference:-1, goalsFor:-1 });

/* Aufsteiger */

const promoted = table2.slice(0,3);

/* Absteiger */

const relegated = table1.slice(-3);

/* Liga wechseln */

for(const team of promoted){
team.league = liga1;
await team.save();
}

for(const team of relegated){
team.league = liga2;
await team.save();
}

}

/* =====================================================
SPIELER ENTWICKLUNG
===================================================== */

await processPlayerDevelopment();

/* =====================================================
SPIELER KARRIERE ENDE
===================================================== */

await processPlayerRetirements();

/* =====================================================
MARKTWERTE UPDATE
===================================================== */

await updateMarketValues();

/* =====================================================
TABELLEN RESET
===================================================== */

const teams = await Team.find();

for(const team of teams){

team.played = 0;
team.points = 0;

team.wins = 0;
team.draws = 0;
team.losses = 0;

team.goalsFor = 0;
team.goalsAgainst = 0;

team.goalDifference = 0;
team.tablePosition = 0;

team.currentMatchday = 1;

team.seasonReady = true;

await team.save();

}

/* =====================================================
SPIELER STATISTIK RESET
===================================================== */

const players = await Player.find();

for(const p of players){

p.seasonStats.games = 0;
p.seasonStats.goals = 0;
p.seasonStats.assists = 0;
p.seasonStats.rating = 6.5;
p.seasonStats.cleanSheets = 0;
p.seasonStats.saves = 0;

await p.save();

}

console.log("Saison beendet");

}

/* =====================================================
NEUE SAISON STARTEN
===================================================== */

async function startNewSeason(){

const leagues = await Team.distinct("league");

/* alte Spiele löschen */

await Match.deleteMany({});

for(const league of leagues){

const teams = await Team.find({ league });

if(teams.length === 18){

await generateLeagueSchedule(teams, league);

}

}

/* Teams freigeben */

const teams = await Team.find();

for(const team of teams){

team.seasonReady = false;

await team.save();

}

console.log("Neue Saison gestartet");

}

module.exports = { processSeasonEnd, startNewSeason };