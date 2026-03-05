const Team = require("../models/Team");
const Player = require("../models/Player");
const Manager = require("../models/Manager");
const Stadium = require("../models/Stadium");

const { generatePlayersForTeam } = require("./playerGenerator");

async function createBotTeam(league) {

const random = Math.floor(Math.random() * 100000);

const team = new Team({

name: "FC Bot " + random,
shortName: "BOT",

country: "Deutschland",

league,

isBot: true,

balance: 3000000

});

await team.save();

/* Spieler */

await generatePlayersForTeam(team);

/* Manager */

await Manager.create({

team: team._id,

firstName: "Bot",
lastName: "Trainer",

age: 45,

rating: 2,

formation: "4-4-2",

playstyle: "Kontern"

});

/* Stadion */

await Stadium.create({

team: team._id,

capacity: 8000,

ticketPrice: 15

});

return team;

}

module.exports = {
createBotTeam
};