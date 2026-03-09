const cron = require("node-cron");

const { simulateMatchday } = require("../services/matchdaySimulator");

function startMatchdaySimulatorCron(){

/* Beispiel: jeden Samstag 18:00 */

cron.schedule("0 18 * * 6", async () => {

try{

console.log("Starte Matchday Simulation");

await simulateMatchday();

console.log("Matchday beendet");

}catch(err){

console.error("Matchday Fehler:",err);

}

});

}

module.exports = { startMatchdaySimulatorCron };