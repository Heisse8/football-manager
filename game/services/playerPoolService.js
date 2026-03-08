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

for(let i=0;i<needed;i++){
await createRandomPlayer();
}

}

/* =====================================================
RANDOM PLAYER GENERATOR
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

/* =====================================================
ALTER
===================================================== */

const age = randomWeightedAge();

/* =====================================================
STERNE
===================================================== */

let stars = generateStars();

/* =====================================================
POTENTIAL
===================================================== */

let potential = stars + Math.random()*1.5;

if(potential > 5) potential = 5;

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

marketValue = random(200000,1000000);

}

else if(stars < 3){

marketValue = random(1000000,5000000);

}

else if(stars < 4){

marketValue = random(5000000,20000000);

}

else if(stars < 5){

marketValue = random(20000000,50000000);

}

else{

marketValue = random(60000000,80000000);

}

/* =====================================================
SPIELER ERSTELLEN
===================================================== */

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

/* Free Agents kommen NICHT automatisch auf den Markt */

isListed:false,
transferType:"auction"

});

}

/* =====================================================
STERNE GENERIEREN
===================================================== */

function generateStars(){

const roll = Math.random();

/* viele schlechte Spieler */

if(roll < 0.50){
return 1 + Math.random();
}

/* durchschnitt */

if(roll < 0.80){
return 2 + Math.random();
}

/* gute */

if(roll < 0.93){
return 3 + Math.random();
}

/* sehr gute */

if(roll < 0.99){
return 4 + Math.random();
}

/* seltene Weltklasse */

return 5;

}

/* =====================================================
ALTER VERTEILUNG
===================================================== */

function randomWeightedAge(){

const roll = Math.random();

/* junge Spieler */

if(roll < 0.40){
return random(17,21);
}

/* prime */

if(roll < 0.80){
return random(22,28);
}

/* ältere */

return random(29,34);

}

/* =====================================================
UTIL
===================================================== */

function random(min,max){
return Math.floor(Math.random()*(max-min+1))+min;
}

module.exports = { maintainPlayerPool };