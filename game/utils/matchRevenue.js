const Stadium = require("../models/Stadium");
const Team = require("../models/Team");
const { calculateAttendance } = require("./stadiumAttendance");

async function generateMatchRevenue(homeTeamId){

const stadium = await Stadium.findOne({ team:homeTeamId });
const team = await Team.findById(homeTeamId);

if(!stadium || !team) return;

const attendance = await calculateAttendance(homeTeamId);

const revenue = attendance * stadium.ticketPrice;

team.balance += revenue;

await team.save();

console.log(
"🏟 Zuschauer:", attendance,
"| Einnahmen:", revenue
);

}

module.exports = { generateMatchRevenue };