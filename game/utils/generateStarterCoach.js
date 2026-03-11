const Coach = require("../models/Coach");
const coachPool = require("../data/coachPool");

async function generateStarterCoach(teamId){

const starters = coachPool.filter(c => c.stars <= 2.5);

const coach =
starters[Math.floor(Math.random()*starters.length)];

const newCoach = new Coach({

team: teamId,

name: coach.name,

stars: coach.stars,

playStyle: coach.playStyle,

favoriteFormation: coach.favoriteFormation,

pressingStyle: coach.pressingStyle,

tempo: coach.tempo,

passingStyle: coach.passingStyle,

mentality: coach.mentality,

adaptation: coach.adaptation,

rotation: coach.rotation

});

await newCoach.save();

return newCoach;

}

module.exports = { generateStarterCoach };