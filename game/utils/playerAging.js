const Player = require("../models/Player");

async function runPlayerAging(){

console.log("👴 Spieler altern");

const players = await Player.find();

for(const player of players){

/* ALTER ERHÖHEN */

player.age += 1;


/* =========================================
ALTERSABBAU
========================================= */

if(player.age >= 30){
player.stars -= 0.1;
}

if(player.age >= 33){
player.stars -= 0.2;
}

if(player.age >= 36){
player.stars -= 0.4;
}


/* MINIMUM */

if(player.stars < 0){
player.stars = 0;
}


/* =========================================
KARRIEREENDE
========================================= */

if(player.age >= 35){

const retirementChance = 0.1 + (player.age - 35) * 0.05;

if(Math.random() < retirementChance){

console.log("🏁 Karriereende:", player.firstName, player.lastName);

await Player.deleteOne({ _id: player._id });

continue;

}

}

await player.save();

}

console.log("✅ Spieler Alterung abgeschlossen");

}

module.exports = { runPlayerAging };