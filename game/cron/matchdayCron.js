const cron = require("node-cron");

const { simulateMatchday } = require("../services/matchdaySimulator");
const { resolveAuctions } = require("../services/transferAuctionService");
const { generateFreeAgents } = require("../services/freeAgentGenerator");
const { runBotTransfers } = require("../services/botTransferService");

/* =========================================
 MATCHDAY CRON
 Dienstag & Samstag 04:00
========================================= */

function startMatchdayCron(){

cron.schedule("0 4 * * 2,6", async () => {

console.log("⚽ Matchday Simulation gestartet");

try{

/* ================= MATCHES ================= */

await simulateMatchday();

console.log("✅ Matchday abgeschlossen");

/* ================= TRANSFER AUKTIONEN ================= */

await resolveAuctions();

console.log("💰 Transfer Auktionen ausgewertet");

await runBotTransfers();

console.log("🤖 Bot Transfers abgeschlossen");

/* ================= FREE AGENTS ================= */

await generateFreeAgents();

console.log("🧑‍🎓 Neue Free Agents generiert");

}catch(err){

console.error("❌ Matchday Fehler:", err);

}

});

}

module.exports = { startMatchdayCron };