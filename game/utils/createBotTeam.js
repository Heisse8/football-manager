const Team = require("../models/Team");
const Manager = require("../models/Manager");

const { assignPlayersToTeam } = require("./playerPool");
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

/* =====================================================
CLUB NAME
===================================================== */

const club = generateClubName();

/* =====================================================
LAND ERMITTELN
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

balance:5000000,

fanBase:0.8,
homeBonus:1

});

await botTeam.save();

/* =====================================================
SPIELER ZUTEILEN (GLEICH WIE USER)
===================================================== */

await assignPlayersToTeam(botTeam);

/* =====================================================
TRAINER ERSTELLEN
===================================================== */

const styles = [
"Ballbesitz",
"Kontern",
"Gegenpressing",
"Mauern"
];

const formations = [
"4-3-3",
"4-4-2",
"4-2-3-1",
"3-5-2"
];

await Manager.create({

team: botTeam._id,

firstName: "Bot",
lastName: "Trainer",

age: 40 + Math.floor(Math.random()*15),

rating: 2 + Math.random()*2,

formation: formations[Math.floor(Math.random()*formations.length)],

playstyle: styles[Math.floor(Math.random()*styles.length)]

});

return botTeam;

}

module.exports = { createBotTeam };