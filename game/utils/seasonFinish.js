const Team = require("../models/Team");
const { applySponsorSeasonBonus } = require("./sponsorSeasonBonus");

async function finishSeason(league){

const teams = await Team.find({ league });

for(const team of teams){

await applySponsorSeasonBonus(team._id);

}

}

module.exports = { finishSeason };