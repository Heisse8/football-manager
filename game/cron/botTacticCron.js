const cron = require("node-cron");

const { updateBotTactics } = require("../services/botTacticService");

function startBotTacticCron(){

/* jeden Tag um 02:30 */

cron.schedule("30 2 * * *", async ()=>{

console.log("🧠 Bot Taktiken werden aktualisiert...");

try{

await updateBotTactics();

console.log("✅ Bot Taktiken aktualisiert");

}catch(err){

console.error("BotTacticCron Fehler:", err);

}

});

}

module.exports = { startBotTacticCron };