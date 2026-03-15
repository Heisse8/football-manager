const Player = require("../models/Player");

async function dailyPlayerRecovery(){

const now = new Date();

/* =====================================================
ALLE SPIELER LADEN
===================================================== */

const players = await Player.find({});

/* =====================================================
SPIELER DURCHGEHEN
===================================================== */

for(const player of players){

/* ================= FITNESS REGEN ================= */

const recovery = 12 + Math.floor(Math.random()*6); // 12‑17

player.fitness = Math.min(100,(player.fitness || 100) + recovery);

/* ================= VERLETZUNG CHECK ================= */

if(player.injuredUntil && player.injuredUntil <= now){

player.injuredUntil = null;

}

/* ================= SPERRE CHECK ================= */

if(player.suspendedUntil && player.suspendedUntil <= now){

player.suspendedUntil = null;

}

/* ================= GELBE KARTEN RESET (optional) ================= */

if(player.yellowCards >= 5){

player.yellowCards = 0;

}

/* ================= SAVE ================= */

await player.save();

}

console.log("Daily Player Recovery abgeschlossen");

}

module.exports = { dailyPlayerRecovery };