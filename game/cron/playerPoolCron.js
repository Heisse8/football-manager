const cron = require("node-cron");

const { maintainPlayerPool } = require("../services/playerPoolService");

function startPlayerPoolCron(){

/* jeden Tag 03:00 */

cron.schedule("0 3 * * *", async ()=>{

console.log("Player Pool Check");

await maintainPlayerPool();

});

}

module.exports = { startPlayerPoolCron };