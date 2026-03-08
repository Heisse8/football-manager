const Team = require("../models/Team");

function randomNumber(){
  return Math.floor(Math.random()*90000)+10000;
}

async function createBotTeam(league){

  const shortName = `BOT${randomNumber()}`;

  const bot = new Team({
    name:`FC Bot ${shortName}`,
    shortName,
    league,
    country:"Deutschland",
    isBot:true,
    balance:5000000,
    fanBase:1,
    homeBonus:1
  });

  await bot.save();

  return bot;
}

module.exports = { createBotTeam };