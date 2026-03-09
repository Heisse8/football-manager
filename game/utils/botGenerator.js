const Team = require("../models/Team");

/* =====================================================
RANDOM NUMBER
===================================================== */

function randomNumber(){
return Math.floor(Math.random()*90000)+10000;
}

/* =====================================================
BOT TEAM ERSTELLEN
===================================================== */

async function createBotTeam(league){

let shortName;
let exists = true;

/* eindeutigen Shortname generieren */

while(exists){

shortName = `BOT${randomNumber()}`;

const team = await Team.findOne({ shortName });

if(!team) exists = false;

}

/* =====================================================
BOT TEAM ERSTELLEN
===================================================== */

const bot = new Team({

name:`FC Bot ${shortName}`,
shortName,

league,
country:"Deutschland",

isBot:true,

/* Finanzen */

balance:8000000,

/* Fanbase */

fanBase:1,

/* Heimvorteil */

homeBonus:1,

/* Stadion */

stadiumLevel:1,
stadiumCapacity:12000,
ticketPrice:18,

/* Sponsor */

sponsor:null,
sponsorReputation:1,

/* Tabelle */

played:0,
points:0,

wins:0,
draws:0,
losses:0,

goalsFor:0,
goalsAgainst:0,
goalDifference:0,

tablePosition:0,

/* Saisonstatus */

seasonReady:false,

/* Bot Kontrolle */

owner:null,

/* Standard Taktik */

formation:"4-4-2",

tactics:{
mentality:"balanced",
pressing:"medium",
defensiveLine:"medium"
}

});

await bot.save();

return bot;

}

/* =====================================================
EXPORT
===================================================== */

module.exports = { createBotTeam };