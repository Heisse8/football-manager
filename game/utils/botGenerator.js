const Team = require("../models/Team");

function randomNumber(){
return Math.floor(Math.random()*900)+100;
}

async function createBotTeam(league){

const short = `BOT${randomNumber()}`;

const bot = new Team({

name:`Bot Team ${short}`,
shortName:short,

country:"GER",
league,

isBot:true,

balance:5000000,

fanBase:1,
homeBonus:1

});

await bot.save();

return bot;

}

module.exports = { createBotTeam };