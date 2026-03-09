const cron = require("node-cron");

const { maintainPlayerPool } = require("../services/playerPoolService");

function startPlayerPoolCron(){

/* täglich 03:00 */

cron.schedule("0 3 * * *", async ()=>{

console.log("🧬 Player Pool Check gestartet");

try{

await maintainPlayerPool();

console.log("✅ Player Pool erfolgreich aktualisiert");

}catch(err){

console.error("❌ PlayerPoolCron Fehler:", err);

}

},{
timezone: "Europe/Berlin"
});

}

module.exports = { startPlayerPoolCron };