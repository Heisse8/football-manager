const cron = require("node-cron");

const { listFreeAgentsOnMarket } = require("../services/freeAgentMarketService");

function startFreeAgentMarketCron(){

/* alle 2 Stunden */

cron.schedule("0 */2 * * *", async ()=>{

console.log("🛒 Free Agents werden auf den Markt gesetzt...");

try{

await listFreeAgentsOnMarket();

console.log("✅ Free Agents erfolgreich gelistet");

}catch(err){

console.error("FreeAgentMarketCron Fehler:", err);

}

});

}

module.exports = { startFreeAgentMarketCron };