const cron = require("node-cron");

const { generateFreeAgents } = require("../services/freeAgentService");

function startFreeAgentCron(){

cron.schedule("0 */6 * * *", async ()=>{

console.log("Free Agent Generator gestartet");

await generateFreeAgents();

});

}

module.exports = { startFreeAgentCron };