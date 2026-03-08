const Team = require("../models/Team");

async function replaceBotTeam(userTeam){

/* Bot Team in gleicher Liga suchen */

const botTeam = await Team.findOne({
league: userTeam.league,
isBot: true
});

if(!botTeam) return;

/* Bot Team in Spieler Team umwandeln */

botTeam.owner = userTeam.owner;

botTeam.name = userTeam.name;
botTeam.shortName = userTeam.shortName;

botTeam.clubIdentity = userTeam.clubIdentity;

botTeam.balance = userTeam.balance;
botTeam.fanBase = userTeam.fanBase;
botTeam.homeBonus = userTeam.homeBonus;

botTeam.isBot = false;

/* speichern */

await botTeam.save();

/* temporäres userTeam löschen */

await Team.deleteOne({ _id: userTeam._id });

}

module.exports = { replaceBotTeam };