const Team = require("../models/Team");

async function applySponsorSeasonBonus(teamId){

const team = await Team.findById(teamId);

if(!team) return;

/* Kein Sponsor */

if(!team.sponsorSeasonBonus) return;

const position = team.tablePosition;

let bonus = 0;

const bonusData = team.sponsorSeasonBonus;

/* ================= BONUS PRÜFEN ================= */

/* höchste Priorität zuerst */

if(bonusData.champion && position === 1){

bonus = bonusData.champion;

}
else if(bonusData.top3 && position <= 3){

bonus = bonusData.top3;

}
else if(bonusData.top5 && position <= 5){

bonus = bonusData.top5;

}
else if(bonusData.top10 && position <= 10){

bonus = bonusData.top10;

}

/* ================= AUSZAHLUNG ================= */

if(bonus > 0){

team.balance += bonus;

console.log(`${team.name} erhält Sponsor Bonus: ${bonus}`);

}

/* ================= SPONSOR RESET ================= */

team.sponsor = null;
team.sponsorPayment = 0;
team.sponsorWinBonus = 0;
team.sponsorSeasonBonus = null;
team.sponsorGamesLeft = 0;

await team.save();

}

module.exports = { applySponsorSeasonBonus };