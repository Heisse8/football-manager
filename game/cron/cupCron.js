const cron = require("node-cron");

const { simulateCupRound } = require("../services/cupService");

function startCupCron(){

/* Donnerstag 04:00 */

cron.schedule("0 4 * * 4", async ()=>{

console.log("Pokalspiele werden simuliert");

await simulateCupRound();

});

}

module.exports = { startCupCron };