const Team = require("../models/Team");

async function replaceBotTeam(userTeam){

const botTeam = await Team.findOne({
league: userTeam.league,
isBot: true
});

if(!botTeam) return;

await Team.deleteOne({ _id: botTeam._id });

}

module.exports = { replaceBotTeam };