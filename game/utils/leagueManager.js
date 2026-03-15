const Team = require("../models/Team");

async function getNextLeague() {

const leagues = [
"DE1","DE2",
"EN1","EN2",
"ES1","ES2",
"IT1","IT2",
"FR1","FR2"
];

/* Suche Liga mit Bot Teams */

for(const league of leagues){

const bot = await Team.findOne({
league,
isBot: true
});

if(bot){
return league;
}

}

/* Falls keine Bots existieren */

throw new Error("Keine Liga mit Bot Teams verfügbar");

}

module.exports = { getNextLeague };