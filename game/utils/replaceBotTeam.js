const Team = require("../models/Team");

async function replaceBotTeam(userTeam){

if(!userTeam.owner){
throw new Error("User Team hat keinen Besitzer");
}

const bot = await Team.findOne({
league: userTeam.league,
isBot: true
});

if(!bot){
console.log("Kein Bot Team verfügbar");
return;   // <- wichtig: nicht crashen
}

/* Bot löschen */

await Team.deleteOne({ _id: bot._id });

console.log(`Bot Team ${bot.name} ersetzt`);

}

module.exports = { replaceBotTeam };