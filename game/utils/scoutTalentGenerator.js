const Player = require("../models/Player");

const firstNames = [
"Luca","Mateo","Rafael","Noah","Luis",
"Gabriel","Leo","Mateus","David","Enzo"
];

const lastNames = [
"Silva","Garcia","Santos","Fernandez",
"Lopez","Costa","Torres","Rodriguez"
];

function random(min,max){
return Math.random() * (max-min) + min;
}

function generateScoutPlayer(team){

const age = 16 + Math.floor(Math.random()*3);

const stars = Number(random(1,2.5).toFixed(1));
const potential = Number(random(3,5).toFixed(1));

return new Player({

firstName:firstNames[Math.floor(Math.random()*firstNames.length)],
lastName:lastNames[Math.floor(Math.random()*lastNames.length)],

nationality:"Scout",

age,

positions:["ST"],

stars,
potential,

pace:50 + Math.random()*40,
shooting:50 + Math.random()*40,
passing:50 + Math.random()*40,
defending:30 + Math.random()*40,
physical:40 + Math.random()*40,
mentality:50 + Math.random()*40,

team

});

}

module.exports = { generateScoutPlayer };