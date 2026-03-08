const Team = require("../../models/Team");
const Player = require("../../models/Player");
const Manager = require("../../models/Manager");
const Stadium = require("../../models/Stadium");

const { generatePlayersForTeam } = require("../playerGenerator");

async function generateBotTeams(league){

const teams = await Team.find({ league });

const missing = 18 - teams.length;

if(missing <= 0) return;

for(let i=0;i<missing;i++){

const botTeam = new Team({

name: "Bot Team " + Math.floor(Math.random()*100000),
shortName: "BOT",

country: "Deutschland",
league,

clubIdentity: "commercial",

isBot: true,

balance: 3000000,

fanBase: 0.8,
homeBonus: 1

});

await botTeam.save();

/* Spieler */

await generatePlayersForTeam(botTeam);

/* Manager */

await Manager.create({

team: botTeam._id,

firstName: "AI",
lastName: "Manager",

age: 45,

rating: 2,

formation: "4-4-2",

playstyle: "Ballbesitz"

});

/* Stadion */

await Stadium.create({

team: botTeam._id,
capacity: 5000,
ticketPrice: 12

});

}

}

module.exports = { generateBotTeams };