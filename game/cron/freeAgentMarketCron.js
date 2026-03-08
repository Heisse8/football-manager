const cron = require("node-cron");

const { listFreeAgentsOnMarket } = require("../services/freeAgentMarketService");

function startFreeAgentMarketCron(){

cron.schedule("0 */2 * * *", async ()=>{

console.log("Free Agents werden auf Markt gesetzt");

await listFreeAgentsOnMarket();

});

}

module.exports = { startFreeAgentMarketCron };