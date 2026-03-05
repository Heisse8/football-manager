const cron = require("node-cron");

const { runMatchday } = require("./matchdayEngine");
const { spawnFreeAgents } = require("./freeAgentGenerator");
const { runPlayerDevelopment } = require("./playerDevelopment");
const { updateMarketValues } = require("./marketValueUpdater");
const { resolveExpiredTransfers } = require("./transferResolver");
const { runAITransferBidding } = require("./aiTransferBidding");
const { runScoutMissionResolver } = require("./scoutMissionResolver");
const { spawnScouts } = require("./scoutGenerator");
const { spawnCoaches } = require("./coachGenerator");
const { runPlayerAging } = require("./playerAging");

/*
=====================================================
 GLOBAL GAME SCHEDULER
=====================================================

Dienstag 04:00 → Liga Spieltag
Samstag 04:00 → Liga Spieltag

Montag 10:00 → neue Free Agents
Freitag 10:00 → neue Free Agents

Mittwoch 12:00 → neue Scouts
Donnerstag 11:00 → neue Trainer

1. des Monats 03:00 → Spielerentwicklung
1. des Monats 03:10 → Spieler altern

Jeden Tag 02:00 → Marktwerte neu berechnen

Jede Stunde → Transferauktionen prüfen

Alle 10 Minuten → KI Teams bieten

Alle 30 Minuten → Scout Missionen prüfen
*/

function startScheduler(){

console.log("🕒 GLOBAL SCHEDULER GESTARTET");

/* =====================================================
 LIGA SPIELTAGE
===================================================== */

cron.schedule("0 4 * * 2", async () => {

try{

console.log("⚽ Dienstag Spieltag gestartet");

await runMatchday();

console.log("✅ Dienstag Spieltag abgeschlossen");

}catch(err){

console.error("❌ Fehler Dienstag Spieltag:", err);

}

});

cron.schedule("0 4 * * 6", async () => {

try{

console.log("⚽ Samstag Spieltag gestartet");

await runMatchday();

console.log("✅ Samstag Spieltag abgeschlossen");

}catch(err){

console.error("❌ Fehler Samstag Spieltag:", err);

}

});

/* =====================================================
 FREE AGENTS GENERATOR
===================================================== */

cron.schedule("0 10 * * 1", async () => {

try{

console.log("🧑‍💼 Free Agents Spawn (Montag)");

await spawnFreeAgents(10);

console.log("✅ Free Agents erstellt");

}catch(err){

console.error("❌ Fehler FreeAgentGenerator:", err);

}

});

cron.schedule("0 10 * * 5", async () => {

try{

console.log("🧑‍💼 Free Agents Spawn (Freitag)");

await spawnFreeAgents(10);

console.log("✅ Free Agents erstellt");

}catch(err){

console.error("❌ Fehler FreeAgentGenerator:", err);

}

});

/* =====================================================
 SCOUT GENERATOR
===================================================== */

cron.schedule("0 12 * * 3", async () => {

try{

console.log("🧑‍💼 Neue Scouts erscheinen auf Transfermarkt");

await spawnScouts(3);

}catch(err){

console.error("❌ Fehler ScoutGenerator:", err);

}

});

/* =====================================================
 COACH GENERATOR
===================================================== */

cron.schedule("0 11 * * 4", async () => {

try{

console.log("👔 Neue Trainer erscheinen auf Transfermarkt");

await spawnCoaches(2);

}catch(err){

console.error("❌ Fehler CoachGenerator:", err);

}

});

/* =====================================================
 SPIELER ENTWICKLUNG
===================================================== */

cron.schedule("0 3 1 * *", async () => {

try{

console.log("📈 Spielerentwicklung gestartet");

await runPlayerDevelopment();

console.log("✅ Spielerentwicklung abgeschlossen");

}catch(err){

console.error("❌ Fehler Spielerentwicklung:", err);

}

});

/* =====================================================
 SPIELER ALTERUNG
===================================================== */

cron.schedule("10 3 1 * *", async () => {

try{

console.log("👴 Spieler altern");

await runPlayerAging();

}catch(err){

console.error("❌ Fehler Spieler Alterung:", err);

}

});

/* =====================================================
 MARKTWERT UPDATE
===================================================== */

cron.schedule("0 2 * * *", async () => {

try{

console.log("💰 Marktwerte Update gestartet");

await updateMarketValues();

console.log("✅ Marktwerte aktualisiert");

}catch(err){

console.error("❌ Fehler Marktwert Update:", err);

}

});

/* =====================================================
 TRANSFER RESOLVER
===================================================== */

cron.schedule("0 * * * *", async () => {

try{

console.log("🔄 Transferauktionen werden geprüft");

await resolveExpiredTransfers();

}catch(err){

console.error("❌ Fehler TransferResolver:", err);

}

});

/* =====================================================
 KI TRANSFER BIDDING
===================================================== */

cron.schedule("*/10 * * * *", async () => {

try{

console.log("🤖 KI Teams prüfen Transfermarkt");

await runAITransferBidding();

}catch(err){

console.error("❌ Fehler KI Transfer Bidding:", err);

}

});

/* =====================================================
 SCOUT MISSION RESOLVER
===================================================== */

cron.schedule("*/30 * * * *", async () => {

try{

console.log("🔎 Scout Missionen prüfen");

await runScoutMissionResolver();

}catch(err){

console.error("❌ Fehler ScoutMissionResolver:", err);

}

});

}

module.exports = { startScheduler };