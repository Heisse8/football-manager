const Team = require("../models/Team");
const Player = require("../models/Player");
const Manager = require("../models/Manager");

/* =====================================================
 FORMATION SLOT MAP
===================================================== */

const formations = {

"4-3-3":[
"GK",
"LB","LCB","RCB","RB",
"LCM","CM","RCM",
"LW","ST","RW"
],

"4-4-2":[
"GK",
"LB","LCB","RCB","RB",
"LM","LCM","RCM","RM",
"LST","RST"
],

"3-5-2":[
"GK",
"LCB","CCB","RCB",
"LWB","LCM","CM","RCM","RWB",
"LST","RST"
],

"4-2-3-1":[
"GK",
"LB","LCB","RCB","RB",
"LCDM","RCDM",
"LW","CAM","RW",
"ST"
]

};

/* =====================================================
 BOT LINEUP
===================================================== */

async function updateBotLineups(){

const bots = await Team.find({ isBot:true });

for(const bot of bots){

const manager = await Manager.findOne({ team:bot._id });

if(!manager) continue;

const formation = formations[manager.formation] || formations["4-3-3"];

/* Spieler laden */

let players = await Player.find({ team:bot._id });

/* nach Stärke sortieren */

players.sort((a,b)=>b.stars - a.stars);

/* Lineup */

const lineup = {};
const usedPlayers = new Set();

/* =====================================================
 STARTELF NACH POSITION
===================================================== */

for(const slot of formation){

let player = players.find(p => 
!usedPlayers.has(p._id.toString()) &&
p.positions &&
p.positions.includes(slot)
);

/* fallback falls keine passende Position */

if(!player){

player = players.find(p =>
!usedPlayers.has(p._id.toString())
);

}

if(player){

lineup[slot] = player._id;

player.startingXI = true;
player.bench = false;

usedPlayers.add(player._id.toString());

}

}

/* =====================================================
 BANK
===================================================== */

const bench = [];

for(const p of players){

if(!usedPlayers.has(p._id.toString())){

p.startingXI = false;
p.bench = true;

bench.push(p._id);

if(bench.length >= 7) break;

}

}

/* =====================================================
 SPIELER SPEICHERN
===================================================== */

await Promise.all(players.map(p => p.save()));

/* =====================================================
 TEAM LINEUP SPEICHERN
===================================================== */

bot.lineup = lineup;
bot.bench = bench;

await bot.save();

}

console.log("🤖 Bot Lineups aktualisiert (Formation berücksichtigt)");

}

module.exports = { updateBotLineups };