const Team = require("../models/Team");

function randomNumber(){
return Math.floor(Math.random()*90000)+10000;
}

async function createBotTeam(league){

let shortName;
let exists = true;

while(exists){

shortName = `BOT${randomNumber()}`;

const team = await Team.findOne({ shortName });

if(!team) exists = false;

}

const bot = new Team({

name:`FC Bot ${shortName}`,
shortName,
league,
country:"Deutschland",
isBot:true,
balance:5000000,
fanBase:1,
homeBonus:1,
owner: undefined

});

await bot.save();

return bot;

}

module.exports = { createBotTeam };