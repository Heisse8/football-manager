const Player = require("../models/Player");

/* =====================================================
 FREE AGENT GENERATOR
===================================================== */

async function generateFreeAgents(){

const listedPlayers = await Player.countDocuments({
team:null
});

const target = 200;

if(listedPlayers >= target){
return;
}

const amount = target - listedPlayers;

let players=[];

for(let i=0;i<amount;i++){

const stars = generateStars();

const value = calculateMarketValue(stars);

players.push({

firstName: random(firstNames),
lastName: random(lastNames),
nationality: random(countries),

age: randomAge(stars),

positions:[random(positionPool)],

stars:stars,
potential: Math.min(5, stars + Math.random()*0.5),

marketValue:value,

pace: randomStat(),
shooting: randomStat(),
passing: randomStat(),
defending: randomStat(),
physical: randomStat(),
mentality: randomStat(),

team:null,

isListed:true,
transferType:"instant",
transferPrice:value

});

}

await Player.insertMany(players);

console.log("🧑‍🎓 Free Agents generiert:", amount);

}

/* =====================================================
 STAR VERTEILUNG
===================================================== */

function generateStars(){

const r = Math.random();

if(r < 0.25) return 1;
if(r < 0.55) return 2;
if(r < 0.80) return 3;
if(r < 0.95) return 4;

return 5;

}

/* =====================================================
 MARKTWERT
===================================================== */

function calculateMarketValue(stars){

switch(stars){

case 1: return Math.floor(20000 + Math.random()*30000);
case 2: return Math.floor(80000 + Math.random()*120000);
case 3: return Math.floor(400000 + Math.random()*600000);
case 4: return Math.floor(2000000 + Math.random()*3000000);
case 5: return Math.floor(8000000 + Math.random()*7000000);

}

}

/* =====================================================
 ALTER
===================================================== */

function randomAge(stars){

if(stars >= 4){
return 18 + Math.floor(Math.random()*10);
}

return 20 + Math.floor(Math.random()*14);

}

/* =====================================================
 STATS
===================================================== */

function randomStat(){
return 40 + Math.floor(Math.random()*50);
}

/* =====================================================
 HELPER
===================================================== */

function random(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

/* =====================================================
 DATA
===================================================== */

const firstNames = [
"Luca","Noah","Leon","Mateo","Julian",
"Lucas","Oliver","Elias","Finn","Theo"
];

const lastNames = [
"Müller","Schmidt","Fischer","Weber","Wagner",
"Becker","Hoffmann","Schneider","Wolf","Neumann"
];

const countries = [
"Deutschland","Spanien","Frankreich",
"Italien","Brasilien","Argentinien",
"England","Portugal","Niederlande"
];

const positionPool = [
"ST","LW","RW",
"CAM","CM","CDM",
"CB","LB","RB",
"GK"
];

module.exports = { generateFreeAgents };