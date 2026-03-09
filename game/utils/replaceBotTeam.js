const Team = require("../models/Team");

async function replaceBotTeam(userTeam){

if(!userTeam.owner){
throw new Error("User Team hat keinen Besitzer");
}

/* schwächsten Bot suchen */

const botTeam = await Team.findOne({
league: userTeam.league,
isBot:true
}).sort({ fanBase:1 });

if(!botTeam){
console.log("Kein Bot Team verfügbar");
return;
}

/* Bot → User */

botTeam.owner = userTeam.owner;

botTeam.name = userTeam.name;
botTeam.shortName = userTeam.shortName;

botTeam.clubIdentity = userTeam.clubIdentity;

botTeam.balance = userTeam.balance;
botTeam.fanBase = userTeam.fanBase;
botTeam.homeBonus = userTeam.homeBonus;

botTeam.isBot = false;

await botTeam.save();

/* temporäres Team löschen */

await Team.deleteOne({ _id:userTeam._id });

console.log("Bot Team ersetzt:", botTeam.name);

}

module.exports = { replaceBotTeam };