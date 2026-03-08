const cron = require("node-cron");

const { runBotTransfers } = require("../services/botTransferAI");

function startBotTransferCron(){

cron.schedule("0 */3 * * *", async ()=>{

console.log("Bot Transfer AI gestartet");

await runBotTransfers();

});

}

module.exports = { startBotTransferCron };