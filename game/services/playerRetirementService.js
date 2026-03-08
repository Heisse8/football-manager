const Player = require("../models/Player");

/* =====================================================
PLAYER RETIREMENTS
===================================================== */

async function processPlayerRetirements(){

const players = await Player.find();

for(const player of players){

/* Rücktritt erst ab 34 */

if(player.age >= 34){

const chance = (player.age - 33) * 0.15;

/*
34 = 15%
35 = 30%
36 = 45%
37 = 60%
38 = 75%
*/

if(Math.random() < chance){

console.log(
`${player.firstName} ${player.lastName} beendet Karriere`
);

/* Spieler entfernen */

await Player.deleteOne({ _id: player._id });

}

}

}

}

module.exports = { processPlayerRetirements };