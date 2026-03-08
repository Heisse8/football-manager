const Scout = require("../models/Scout");
const Team = require("../models/Team");
const { generateScoutPlayer } = require("./scoutTalentGenerator");

async function runScoutSearch(){

const scouts = await Scout.find({
activeSearch:true
});

for(const scout of scouts){

/* 20% Chance Talent zu finden */

if(Math.random() > 0.2) continue;

const player = generateScoutPlayer(scout.team);

await player.save();

console.log("🔎 Scout hat Talent gefunden:", player.lastName);

scout.activeSearch = false;
scout.searchStarted = null;

await scout.save();

}

}

module.exports = { runScoutSearch };