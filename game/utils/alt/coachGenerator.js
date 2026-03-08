const Coach = require("../models/Coach");

const firstNames = [
"Marco","Luis","Carlos","David","Antonio","Markus","Peter","Giovanni"
];

const lastNames = [
"Rossi","Müller","Garcia","Silva","Fernandes","Costa","Schmidt"
];

function random(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

function randomStars(){

const values = [
1,1.5,2,2.5,3,3.5,4,4.5,5
];

return random(values);
}

async function generateCoach(){

const coach = await Coach.create({

firstName: random(firstNames),
lastName: random(lastNames),

nationality:"Unknown",

age: 35 + Math.floor(Math.random()*30),

stars: randomStars(),

philosophy: random([
"ballbesitz",
"gegenpressing",
"konter",
"defensiv"
]),

preferredFormation: random([
"442",
"433",
"4231",
"352",
"541"
])

});

return coach;

}

module.exports = { generateCoach };