const cron = require("node-cron");

const { updateBotLineups } = require("../services/botLineupService");

function startBotLineupCron(){

/* täglich um 03:00 */

cron.schedule("0 3 * * *", async ()=>{

console.log("Bot Lineups werden aktualisiert");

await updateBotLineups();

});

}

module.exports = { startBotLineupCron };