const cron = require("node-cron");

const { runBotTransfers } = require("../services/botTransferAI");

function startBotTransferCron(){

/* alle 3 Stunden */

cron.schedule("0 */3 * * *", async ()=>{

console.log("💰 Bot Transfer AI gestartet...");

try{

await runBotTransfers();

console.log("✅ Bot Transfers abgeschlossen");

}catch(err){

console.error("BotTransferCron Fehler:", err);

}

});

}

module.exports = { startBotTransferCron };