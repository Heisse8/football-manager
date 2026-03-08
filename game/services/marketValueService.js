const Player = require("../models/Player");

async function updateMarketValues(){

const players = await Player.find({ team:{ $ne:null } });

for(const player of players){

let value = player.stars * 500000;

const stats = player.seasonStats || {};

/* Performance */

value += (stats.goals || 0) * 120000;
value += (stats.assists || 0) * 80000;

/* Rating */

value *= (stats.rating || 6.5) / 6.5;

/* Alter */

if(player.age < 23) value *= 1.15;
if(player.age > 30) value *= 0.85;

/* Potential */

if(player.potential > player.stars){
value *= 1.1;
}

value = Math.max(20000,value);

player.marketValue = Math.round(value);

await player.save();

}

console.log("Marktwerte aktualisiert");

}

module.exports = { updateMarketValues };