const cron = require("node-cron");

const { dailyPlayerRecovery } = require("../services/playerRecovery");

function startPlayerRecoveryCron(){

/* Jeden Tag um 04:00 */

cron.schedule("0 4 * * *", async () => {

try{

console.log("Starte Player Recovery");

await dailyPlayerRecovery();

}catch(err){

console.error("Player Recovery Fehler:",err);

}

});

}

module.exports = { startPlayerRecoveryCron };