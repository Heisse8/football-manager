const Team = require("../models/Team");

/* =====================================================
SPONSOR LISTE
===================================================== */

const sponsors = [

{
name:"Lokaler Sponsor",
payment:150000,
winBonus:50000,
reputation:1
},

{
name:"Nationaler Sponsor",
payment:300000,
winBonus:80000,
reputation:2
},

{
name:"Globaler Sponsor",
payment:600000,
winBonus:120000,
reputation:3
}

];

/* =====================================================
SPONSOR ANGEBOTE GENERIEREN
===================================================== */

function generateSponsorOffers(team){

const possible = sponsors.filter(
s => s.reputation <= team.sponsorReputation + 1
);

const shuffled = possible.sort(()=>Math.random()-0.5);

return shuffled.slice(0,3);

}

/* =====================================================
SPONSOR ANNEHMEN
===================================================== */

async function acceptSponsor(teamId,sponsorName){

const team = await Team.findById(teamId);

const sponsor = sponsors.find(s=>s.name === sponsorName);

if(!sponsor){
throw new Error("Sponsor nicht gefunden");
}

team.sponsor = sponsor.name;
team.sponsorPayment = sponsor.payment;
team.sponsorWinBonus = sponsor.winBonus;
team.sponsorGamesLeft = 34;

/* Sofortige Zahlung */

team.balance += sponsor.payment;

await team.save();

return team;

}

/* =====================================================
SIEG BONUS
===================================================== */

async function paySponsorWinBonus(team){

if(!team.sponsor) return;

team.balance += team.sponsorWinBonus;

await team.save();

}

/* =====================================================
SPIELTAG REDUZIEREN
===================================================== */

async function reduceSponsorGames(team){

if(!team.sponsor) return;

team.sponsorGamesLeft -= 1;

if(team.sponsorGamesLeft <= 0){

team.sponsor = null;
team.sponsorPayment = 0;
team.sponsorWinBonus = 0;
team.sponsorGamesLeft = 0;

}

await team.save();

}

module.exports = {
generateSponsorOffers,
acceptSponsor,
paySponsorWinBonus,
reduceSponsorGames
};