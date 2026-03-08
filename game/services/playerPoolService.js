const Player = require("../models/Player");

/* =====================================================
FREE AGENT GENERATOR
===================================================== */

async function maintainPlayerPool(){

const totalPlayers = await Player.countDocuments();

const targetPlayers = 2000;

if(totalPlayers >= targetPlayers){
return;
}

const needed = targetPlayers - totalPlayers;

console.log("Generiere neue Free Agents:", needed);

for(let i=0;i<needed;i++){

await createRandomPlayer();

}

}

/* =====================================================
RANDOM PLAYER
===================================================== */

async function createRandomPlayer(){

const firstNames = [
"Luca","Jonas","David","Noah","Leo","Ben","Elias","Finn","Tom","Paul"
];

const lastNames = [
"Müller","Schmidt","Schneider","Fischer","Weber","Meyer","Wagner"
];

const nationalities = [
"GER","ENG","ESP","ITA","FRA","BRA","ARG","NED","POR","BEL"
];

const positions = [
["GK"],
["CB"],
["CB"],
["LB"],
["RB"],
["CM"],
["CM"],
["CAM"],
["LW"],
["RW"],
["ST"]
];

/* Alter */

const age = random(17,34);

/* Sterne */

let stars = generateStars();

/* Potential */

let potential = stars + random(0,2);

if(potential > 5) potential = 5;

/* Attribute */

const pace = random(40,90);
const shooting = random(40,90);
const passing = random(40,90);
const defending = random(40,90);
const physical = random(40,90);
const mentality = random(40,90);

/* Marktwert */

const marketValue = Math.round(stars * 500000 + random(0,300000));

await Player.create({

firstName:firstNames[random(0,firstNames.length-1)],
lastName:lastNames[random(0,lastNames.length-1)],

nationality:nationalities[random(0,nationalities.length-1)],

age,

positions:positions[random(0,positions.length-1)],

stars,
potential,

pace,
shooting,
passing,
defending,
physical,
mentality,

marketValue,

team:null,
isListed:true,
transferType:"auction"

});

}

/* =====================================================
STAR GENERATION
===================================================== */

function generateStars(){

const roll = Math.random();

if(roll < 0.50) return 1 + Math.random();
if(roll < 0.75) return 2 + Math.random();
if(roll < 0.90) return 3 + Math.random();
if(roll < 0.98) return 4 + Math.random();

return 5;

}

/* =====================================================
UTIL
===================================================== */

function random(min,max){
return Math.floor(Math.random()*(max-min+1))+min;
}

module.exports = { maintainPlayerPool };