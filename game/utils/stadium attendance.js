const Stadium = require("../models/Stadium");
const Team = require("../models/Team");

function random(min,max){
return Math.random()*(max-min)+min;
}

async function calculateAttendance(homeTeamId){

const team = await Team.findById(homeTeamId);
const stadium = await Stadium.findOne({ team:homeTeamId });

if(!team || !stadium) return 0;

let base = team.fanBase * 4000;

const formFactor = random(0.8,1.2);

let attendance = base * formFactor;

if(attendance > stadium.capacity){
attendance = stadium.capacity;
}

return Math.round(attendance);
}

module.exports = { calculateAttendance };