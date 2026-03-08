const Team = require("../models/Team");

async function applySponsorSeasonBonus(teamId){

const team = await Team.findById(teamId);

if(!team) return;

/* Kein Sponsor */

if(!team.sponsorSeasonBonus) return;

const position = team.tablePosition;

let bonus = 0;

/* ================= BONUS PRÜFEN ================= */

if(team.sponsorSeasonBonus.champion && position === 1){

bonus = team.sponsorSeasonBonus.champion;

}

else if(team.sponsorSeasonBonus.top3 && position <= 3){

bonus = team.sponsorSeasonBonus.top3;

}

else if(team.sponsorSeasonBonus.top5 && position <= 5){

bonus = team.sponsorSeasonBonus.top5;

}

else if(team.sponsorSeasonBonus.top10 && position <= 10){

bonus = team.sponsorSeasonBonus.top10;

}

/* ================= AUSZAHLUNG ================= */

if(bonus > 0){

team.balance += bonus;

}

/* Sponsor zurücksetzen für neue Saison */

team.sponsor = null;
team.sponsorPayment = 0;
team.sponsorWinBonus = 0;
team.sponsorSeasonBonus = null;

await team.save();

}

module.exports = { applySponsorSeasonBonus };