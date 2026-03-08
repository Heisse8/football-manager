const Team = require("../models/Team");
const Player = require("../models/Player");

/* =====================================================
BOT LINEUP
===================================================== */

async function updateBotLineups(){

const bots = await Team.find({ isBot:true });

for(const bot of bots){

const players = await Player.find({ team:bot._id });

/* nach Stärke sortieren */

players.sort((a,b)=>b.stars - a.stars);

/* beste 11 */

const startingXI = players.slice(0,11);
const bench = players.slice(11,18);

/* Lineup speichern */

const lineup = {};

let i = 0;

for(const p of startingXI){

lineup[`slot${i}`] = p._id;

p.startingXI = true;
p.bench = false;

await p.save();

i++;

}

/* Bank */

for(const p of bench){

p.startingXI = false;
p.bench = true;

await p.save();

}

bot.lineup = lineup;

await bot.save();

}

console.log("Bot Lineups aktualisiert");

}

module.exports = { updateBotLineups };