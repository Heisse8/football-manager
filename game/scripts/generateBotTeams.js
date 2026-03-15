require("dotenv").config();

const mongoose = require("mongoose");

const Player = require("../models/Player");
const Team = require("../models/Team");

/* ==========================================
TEAM NAMEN (DEV MODE)
========================================== */

const TEAM_NAMES = [

"FC Nordstadt",
"SV Grünwald",
"TSV Rheintal",
"Borussia Hafen",
"FC Bergheim",
"Union Süd",
"VfL Neustadt",
"SC Adler",
"Rot Weiß Talheim",
"Blau Weiss Linden",

"Eintracht West",
"SV Königsberg",
"FC Viktoria",
"Fortuna Südstadt",
"TSV Hafenstadt",
"SC Waldhof",
"Borussia Stein",
"FC Rheinhafen"

];

/* ==========================================
MAIN
========================================== */

async function run(){

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB verbunden");

/* ==========================================
SPIELER LADEN
========================================== */

const players = await Player.find({ team: null });

console.log("Freie Spieler:",players.length);

/* ==========================================
TEAMS ERSTELLEN
========================================== */

const teams = [];

let i = 1;

for (const name of TEAM_NAMES) {

  const team = await Team.create({
    name,
    shortName: "BOT" + i,
    country: "Germany",
    league: "Bundesliga",
    budget: 50000000
  });

  teams.push(team);

  i++;

}

console.log("Teams erstellt:", teams.length);

/* ==========================================
SPIELER MISCHEN
========================================== */

players.sort(()=>Math.random()-0.5);

/* ==========================================
SPIELER VERTEILEN
========================================== */

let teamIndex = 0;

for(const player of players){

const team = teams[teamIndex];

player.team = team._id;

await player.save();

teamIndex++;

if(teamIndex >= teams.length){

teamIndex = 0;

}

}

console.log("Spieler verteilt");

/* ==========================================
FERTIG
========================================== */

console.log("Fertig");

process.exit();

}

run();