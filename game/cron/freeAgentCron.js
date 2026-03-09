const cron = require("node-cron");

const { generateFreeAgents } = require("../services/freeAgentService");

function startFreeAgentCron(){

/* alle 6 Stunden */

cron.schedule("0 */6 * * *", async ()=>{

console.log("🧑‍💼 Free Agent Generator gestartet...");

try{

await generateFreeAgents();

console.log("✅ Neue Free Agents erstellt");

}catch(err){

console.error("FreeAgentCron Fehler:", err);

}

});

}

module.exports = { startFreeAgentCron };