const cron = require("node-cron");

const { processSeasonEnd, startNewSeason } = require("../services/seasonService");

function startSeasonCron(){

/* =====================================================
SAISON CHECK
läuft jeden Tag um 05:00
===================================================== */

cron.schedule("0 5 * * *", async ()=>{

console.log("🏆 Season Check gestartet");

try{

/* Saisonende prüfen */

await processSeasonEnd();

/* neue Saison prüfen */

await startNewSeason();

console.log("✅ Season Check abgeschlossen");

}catch(err){

console.error("❌ SeasonCron Fehler:", err);

}

},{
timezone: "Europe/Berlin"
});

}

module.exports = { startSeasonCron };