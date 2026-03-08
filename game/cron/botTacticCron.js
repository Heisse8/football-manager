const cron = require("node-cron");

const { updateBotTactics } = require("../services/botTacticService");

function startBotTacticCron(){

/* jeden Tag 02:30 */

cron.schedule("30 2 * * *", async ()=>{

console.log("Bot Taktiken werden aktualisiert");

await updateBotTactics();

});

}

module.exports = { startBotTacticCron };