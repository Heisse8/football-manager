const cron = require("node-cron");

const { processSeasonEnd, startNewSeason } = require("../services/seasonService");

function startSeasonCron(){

/* =====================================================
SAISON ENDE
===================================================== */

/*
läuft jeden Tag um 05:00
prüft ob Saison fertig ist
*/

cron.schedule("0 5 * * *", async ()=>{

try{

console.log("Season Check gestartet");

await processSeasonEnd();

}catch(err){

console.error("Season End Fehler:", err);

}

});

/* =====================================================
NEUE SAISON STARTEN (4 Wochen Pause)
===================================================== */

cron.schedule("0 5 * * *", async ()=>{

try{

console.log("Season Start Check");

await startNewSeason();

}catch(err){

console.error("Season Start Fehler:", err);

}

});

}

module.exports = { startSeasonCron };