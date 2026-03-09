const Player = require("../models/Player");

/* =====================================================
PLAYER RETIREMENTS
===================================================== */

async function processPlayerRetirements(){

const players = await Player.find();

for(const player of players){

/* Rücktritt erst ab 34 */

if(player.age < 34) continue;

/* =====================================================
RÜCKTRITT CHANCE
===================================================== */

let chance = (player.age - 33) * 0.15;

/*
34 = 15%
35 = 30%
36 = 45%
37 = 60%
38 = 75%
*/

/* Stars spielen länger */

if(player.stars >= 4){
chance *= 0.6;
}

/* Maximum 95% */

chance = Math.min(chance,0.95);

/* =====================================================
RÜCKTRITT
===================================================== */

if(Math.random() < chance){

console.log(
`👴 ${player.firstName} ${player.lastName} beendet Karriere`
);

await Player.deleteOne({ _id: player._id });

}

}

console.log("Spieler-Rücktritte verarbeitet");

}

module.exports = { processPlayerRetirements };