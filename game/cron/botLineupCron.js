const cron = require("node-cron");

const { updateBotLineups } = require("../services/botLineupService");

function startBotLineupCron(){

/* täglich um 03:00 */

cron.schedule("0 3 * * *", async ()=>{

console.log("🤖 Bot Lineups werden aktualisiert...");

try{

await updateBotLineups();

console.log("✅ Bot Lineups aktualisiert");

}catch(err){

console.error("BotLineupCron Fehler:", err);

}

});

}

module.exports = { startBotLineupCron };