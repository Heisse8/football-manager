const Scout = require("../../models/Scout");
const ScoutReport = require("../models/ScoutReport");

function random(min,max){
return Math.random()*(max-min)+min;
}

function generatePlayers(scout){

let count = 3;

if(scout.mission.duration === 7) count = 4;
if(scout.mission.duration === 14) count = 6;

const players = [];

for(let i=0;i<count;i++){

let potential = 3;

const roll = Math.random();

const fiveStarChance = scout.stars * 0.01; // max 5%

if(roll < fiveStarChance){
potential = 5;
}
else if(roll < 0.35){
potential = 4;
}
else{
potential = 3;
}

players.push({

age:16 + Math.floor(Math.random()*3),

stars:Number(random(0.5,2).toFixed(1)),

potential

});

}

return players;

}

async function runScoutMissionResolver(){

const now = new Date();

const scouts = await Scout.find({
busyUntil:{ $lt:now }
});

for(const scout of scouts){

if(!scout.team) continue;

const players = generatePlayers(scout);

const expire = new Date();
expire.setDate(expire.getDate()+3);

await ScoutReport.create({

team:scout.team,

scout:scout._id,

players,

expiresAt:expire

});

scout.busyUntil = null;
scout.mission = null;

await scout.save();

}

}

module.exports = { runScoutMissionResolver };