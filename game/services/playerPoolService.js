const Player = require("../models/Player");

/* =====================================================
FREE AGENT POOL MAINTENANCE
===================================================== */

async function maintainPlayerPool(){

const totalPlayers = await Player.countDocuments();

const targetPlayers = 2000;

if(totalPlayers >= targetPlayers){
return;
}

const needed = targetPlayers - totalPlayers;

console.log("Generiere neue Free Agents:", needed);

const players = [];

for(let i=0;i<needed;i++){
players.push(generateRandomPlayer());
}

await Player.insertMany(players);

}

/* =====================================================
RANDOM PLAYER GENERATOR
===================================================== */

function generateRandomPlayer(){

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

/* =====================================================
ALTER
===================================================== */

const age = randomWeightedAge();

/* =====================================================
STERNE
===================================================== */

let stars = generateStars();
stars = Math.min(stars,5);

/* =====================================================
POTENTIAL
===================================================== */

let potential = stars + Math.random()*1.5;
potential = Math.min(potential,5);

/* =====================================================
ATTRIBUTE
===================================================== */

const pace = random(40,90);
const shooting = random(40,90);
const passing = random(40,90);
const defending = random(40,90);
const physical = random(40,90);
const mentality = random(40,90);

/* =====================================================
MARKTWERT
===================================================== */

let marketValue = 0;

if(stars < 2){
marketValue = random(100000,500000);
}
else if(stars < 3){
marketValue = random(500000,2000000);
}
else if(stars < 4){
marketValue = random(2000000,8000000);
}
else if(stars < 5){
marketValue = random(8000000,20000000);
}
else{
marketValue = random(20000000,40000000);
}

/* =====================================================
SPIELER OBJEKT
===================================================== */

return {

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

isListed:false,
transferType:"auction"

};

}

/* =====================================================
STERNE GENERIEREN
===================================================== */

function generateStars(){

const roll = Math.random();

if(roll < 0.50){
return 1 + Math.random();
}

if(roll < 0.80){
return 2 + Math.random();
}

if(roll < 0.93){
return 3 + Math.random();
}

if(roll < 0.99){
return 4 + Math.random();
}

return 5;

}

/* =====================================================
ALTER VERTEILUNG
===================================================== */

function randomWeightedAge(){

const roll = Math.random();

if(roll < 0.40){
return random(17,21);
}

if(roll < 0.80){
return random(22,28);
}

return random(29,34);

}

/* =====================================================
UTIL
===================================================== */

function random(min,max){
return Math.floor(Math.random()*(max-min+1))+min;
}

module.exports = { maintainPlayerPool };