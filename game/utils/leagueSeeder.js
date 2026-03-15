const Team = require("../models/Team");
const { createBotTeam } = require("./botGenerator");

const leagues = [

/* Deutschland */

{ country:"Deutschland", league:"DE1" },
{ country:"Deutschland", league:"DE2" },

/* England */

{ country:"England", league:"EN1" },
{ country:"England", league:"EN2" },

/* Spanien */

{ country:"Spanien", league:"ES1" },
{ country:"Spanien", league:"ES2" },

/* Italien */

{ country:"Italien", league:"IT1" },
{ country:"Italien", league:"IT2" },

/* Frankreich */

{ country:"Frankreich", league:"FR1" },
{ country:"Frankreich", league:"FR2" }

];

async function seedLeagues(){

for(const l of leagues){

const existing = await Team.countDocuments({ league:l.league });

if(existing >= 18){

console.log(`Liga ${l.league} existiert bereits`);
continue;

}

const botsNeeded = 18 - existing;

console.log(`Erstelle ${botsNeeded} Bots für ${l.league}`);

for(let i=0;i<botsNeeded;i++){

await createBotTeam(l.league);

}

}

}

module.exports = { seedLeagues };