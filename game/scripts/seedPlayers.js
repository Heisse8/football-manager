const mongoose = require("mongoose");
const Player = require("../models/Player");
const { generateAttributes } = require("../utils/playerAttributes");
const players = require("../data/bundesligaPlayers");
require("dotenv").config();

async function seed(){

try{

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB verbunden");

await Player.deleteMany({});

console.log("Alte Spieler gelöscht");

for(const p of players){

const attrs = generateAttributes(p);

const player = new Player({

...p,

pace: Math.min(attrs.pace,99),
shooting: Math.min(attrs.shooting,99),
passing: Math.min(attrs.passing,99),
defending: Math.min(attrs.defending,99),
physical: Math.min(attrs.physical,99),
mentality: Math.min(attrs.mentality,99)

});

await player.save();

}

console.log("Spieler importiert");

await mongoose.disconnect();

process.exit();

}catch(err){

console.error(err);
process.exit(1);

}

}

seed();