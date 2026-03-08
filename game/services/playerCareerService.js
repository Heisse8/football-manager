const Player = require("../models/Player");

/* =====================================================
SPIELER ALTER + KARRIERE ENDE
===================================================== */

async function processPlayerCareers(){

const players = await Player.find({});

for(const player of players){

/* Alter erhöhen */

player.age += 1;

/* =====================================================
RÜCKTRITT CHANCE
===================================================== */

let retireChance = 0;

if(player.age >= 34) retireChance = 0.10;
if(player.age >= 36) retireChance = 0.25;
if(player.age >= 38) retireChance = 0.50;
if(player.age >= 40) retireChance = 0.90;

/* Stars bleiben länger */

if(player.stars >= 4){
retireChance *= 0.6;
}

/* Rücktritt prüfen */

if(Math.random() < retireChance){

console.log("Spieler beendet Karriere:", player.lastName);

await Player.deleteOne({ _id: player._id });

continue;

}

/* Leistungsabfall im Alter */

if(player.age > 32){

player.pace *= 0.95;
player.physical *= 0.95;

}

/* Entwicklung junger Spieler */

if(player.age <= 23 && player.potential > player.stars){

player.stars += 0.1;

}

await player.save();

}

console.log("Karrieren verarbeitet");

}

module.exports = { processPlayerCareers };