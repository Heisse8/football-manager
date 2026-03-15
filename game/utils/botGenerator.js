const Team = require("../models/Team");
const Manager = require("../models/Manager");

const cityNames = require("./cityNames");
const { generateClubName } = require("./clubNameGenerator");

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
CLUB NAME GENERIEREN
===================================================== */

const club = generateClubName();

/* =====================================================
LAND AUS LIGA ERKENNEN
===================================================== */

let country = "Deutschland";

if(league.startsWith("EN")) country = "England";
if(league.startsWith("ES")) country = "Spanien";
if(league.startsWith("IT")) country = "Italien";
if(league.startsWith("FR")) country = "Frankreich";

/* =====================================================
TEAM ERSTELLEN
===================================================== */

const botTeam = new Team({

name: club.name,

shortName: club.shortName + randomNumber(),

league,
country,

isBot:true,

/* Finanzen */

balance:5000000,

/* Fanbase */

fanBase:0.8,

/* Heimvorteil */

homeBonus:1

});

await botTeam.save();

/* =====================================================
TRAINER ERSTELLEN
===================================================== */

const styles = [
"ballbesitz",
"konter",
"gegenpressing",
"mauern"
];

await Manager.create({

team: botTeam._id,

firstName: "Bot",
lastName: "Trainer",

age: 45,

rating: 2,

formation: "4-4-2",

playstyle: styles[Math.floor(Math.random()*styles.length)]

});

return botTeam;

}

module.exports = { createBotTeam };