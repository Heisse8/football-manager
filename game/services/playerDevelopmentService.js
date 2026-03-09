const Player = require("../models/Player");

/* =====================================================
PLAYER DEVELOPMENT
===================================================== */

async function processPlayerDevelopment(){

const players = await Player.find();

for(const p of players){

let change = 0;

const stats = p.seasonStats || {};

/* =====================================================
ALTER BASIERTE ENTWICKLUNG
===================================================== */

if(p.age <= 20){

change = Math.random() * 0.4;

}
else if(p.age <= 24){

change = Math.random() * 0.25;

}
else if(p.age <= 28){

change = Math.random() * 0.1;

}
else if(p.age <= 31){

change = -(Math.random() * 0.1);

}
else if(p.age <= 34){

change = -(Math.random() * 0.25);

}
else{

change = -(Math.random() * 0.5);

}

/* =====================================================
SPIELZEIT EINFLUSS
===================================================== */

const games = stats.games || 0;

if(games > 25){

change *= 1.25;

}
else if(games > 15){

change *= 1.10;

}
else if(games < 5){

change *= 0.70;

}

/* =====================================================
POTENTIAL LIMIT
===================================================== */

let newStars = p.stars + change;

if(p.potential){

newStars = Math.min(newStars, p.potential);

}

/* STARS LIMIT */

p.stars = Math.max(0.5, Math.min(5, newStars));

/* =====================================================
ATTRIBUTE ANPASSEN
===================================================== */

p.pace = clamp(p.pace + change * 10);
p.shooting = clamp(p.shooting + change * 8);
p.passing = clamp(p.passing + change * 8);
p.defending = clamp(p.defending + change * 8);
p.physical = clamp(p.physical + change * 8);
p.mentality = clamp(p.mentality + change * 5);

/* =====================================================
SPEICHERN
===================================================== */

await p.save();

}

console.log("Spielerentwicklung abgeschlossen");

}

/* =====================================================
UTIL
===================================================== */

function clamp(v){

if(v < 1) return 1;
if(v > 99) return 99;

return Math.round(v);

}

module.exports = { processPlayerDevelopment };