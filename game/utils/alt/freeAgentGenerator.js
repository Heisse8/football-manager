const Player = require("../models/Player");
const Transfer = require("../models/Transfer");

function random(min,max){
return Math.random()*(max-min)+min;
}

/* ⭐ Sterneverteilung */

function generateStars(){

const roll = Math.random();

if (roll < 0.25) return 1 + Math.random();        // 1-2⭐
if (roll < 0.55) return 2 + Math.random();        // 2-3⭐
if (roll < 0.80) return 3 + Math.random();        // 3-4⭐
if (roll < 0.95) return 4 + Math.random()*0.5;    // 4-4.5⭐

return 5; // selten
}

/* 💰 Preis */

function calculatePrice(stars,age){

let base = stars * 2000000;

if(age < 21) base *= 1.4;
if(age > 30) base *= 0.7;

return Math.round(base);
}

/* 👤 Namen */

const firstNames = [
"Lucas","Mateo","Daniel","Ivan","Carlos",
"Thiago","Leon","Marco","Luis","David"
];

const lastNames = [
"Silva","Garcia","Santos","Costa",
"Martinez","Rodriguez","Fernandez",
"Lopez","Torres","Ramos"
];

/* Positionen */

const positions = [
["GK"],
["LB"],["RB"],["CB"],
["CDM"],["CM"],["CAM"],
["LW"],["RW"],
["ST"]
];

async function spawnFreeAgents(amount=10){

for(let i=0;i<amount;i++){

const stars = Number(generateStars().toFixed(1));

const age = Math.floor(random(18,33));

const position = positions[
Math.floor(Math.random()*positions.length)
];

const player = await Player.create({

firstName:firstNames[Math.floor(Math.random()*firstNames.length)],

lastName:lastNames[Math.floor(Math.random()*lastNames.length)],

age,

stars,

positions:position,

team:null

});

/* Preis */

const startPrice = calculatePrice(stars,age);

/* Auktion */

await Transfer.create({

player:player._id,

sellerTeam:null,

type:"auction",

price:startPrice,

currentBid:startPrice,

endTime:new Date(Date.now()+48*60*60*1000)

});

}

}

module.exports = {
spawnFreeAgents
};