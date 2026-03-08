const Player = require("../models/Player");

const firstNames = [
"Lucas","Mateo","Noah","Liam","Julian","Marco","Leon","David","Paul","Alex"
];

const lastNames = [
"Silva","Müller","Rossi","Garcia","Kovač","Novak","Santos","Costa","Keller","Schmidt"
];

const positions = [
"ST","LW","RW","CAM","CM","CDM","CB","LB","RB","GK"
];

function random(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

function generateStars(){

const r = Math.random();

if(r < 0.50) return 1 + Math.random()*1;      // 1‑2
if(r < 0.80) return 2 + Math.random()*1;      // 2‑3
if(r < 0.95) return 3 + Math.random()*1;      // 3‑4
if(r < 0.995) return 4 + Math.random()*0.7;   // 4‑4.7

return 5;

}

/* =====================================================
FREE AGENT GENERATOR
===================================================== */

async function generateFreeAgents(){

const count = await Player.countDocuments({
team:null,
isListed:false
});

if(count >= 100){
console.log("Genug Free Agents vorhanden");
return;
}

const amount = 30;

for(let i=0;i<amount;i++){

const stars = generateStars();

const player = new Player({

firstName: random(firstNames),
lastName: random(lastNames),

age: 17 + Math.floor(Math.random()*18),

positions: [random(positions)],

stars: Number(stars.toFixed(1)),
potential: Math.min(5,stars + Math.random()),

pace: 40 + Math.random()*50,
shooting: 40 + Math.random()*50,
passing: 40 + Math.random()*50,
defending: 40 + Math.random()*50,
physical: 40 + Math.random()*50,
mentality: 40 + Math.random()*50,

marketValue: Math.round(50000 + stars * 400000)

});

await player.save();

}

console.log("Neue Free Agents erstellt:", amount);

}

module.exports = { generateFreeAgents };