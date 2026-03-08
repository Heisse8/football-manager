const { generateCoach } = require("./coachGenerator");

async function spawnFreeAgentCoaches(amount = 3){

for(let i=0;i<amount;i++){

await generateCoach();

}

}

module.exports = { spawnFreeAgentCoaches };