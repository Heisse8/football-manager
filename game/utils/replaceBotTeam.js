const Team = require("../models/Team");

async function replaceBotTeam(data){

const bot = await Team.findOne({
league: data.league,
isBot: true
});

if(!bot){
throw new Error("Kein Bot Team verfügbar");
}

await Team.deleteOne({ _id: bot._id });

console.log(`Bot Team ${bot.name} ersetzt`);
}

module.exports = { replaceBotTeam };