const Player = require("../models/Player");

async function updateMarketValues(){

const players = await Player.find({ team:{ $ne:null } });

const bulk = [];

for(const player of players){

let value = Math.pow(player.stars,2) * 300000;

const stats = player.seasonStats || {};

/* =====================================================
 PERFORMANCE
===================================================== */

value += (stats.goals || 0) * 150000;
value += (stats.assists || 0) * 100000;

/* =====================================================
 RATING
===================================================== */

const rating = Math.max(5.5, stats.rating || 6.5);

value *= rating / 6.5;

/* =====================================================
 ALTER
===================================================== */

if(player.age < 23) value *= 1.15;
if(player.age > 30) value *= 0.85;

/* =====================================================
 POTENTIAL
===================================================== */

if(player.potential > player.stars){

value *= 1.1;

}

/* Minimum */

value = Math.max(20000,value);

bulk.push({
updateOne:{
filter:{ _id:player._id },
update:{ marketValue: Math.round(value) }
}
});

}

if(bulk.length){

await Player.bulkWrite(bulk);

}

console.log("📈 Marktwerte aktualisiert");

}

module.exports = { updateMarketValues };