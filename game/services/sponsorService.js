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

/* mischen */

const shuffled = [...possible].sort(()=>Math.random()-0.5);

return shuffled.slice(0,3);

}

/* =====================================================
SPONSOR ANNEHMEN
===================================================== */

async function acceptSponsor(teamId,sponsorName){

const team = await Team.findById(teamId);

if(!team){
throw new Error("Team nicht gefunden");
}

if(team.sponsor){
throw new Error("Team hat bereits einen Sponsor");
}

const sponsor = sponsors.find(s=>s.name === sponsorName);

if(!sponsor){
throw new Error("Sponsor nicht gefunden");
}

/* Sponsor setzen */

team.sponsor = sponsor.name;
team.sponsorPayment = sponsor.payment;
team.sponsorWinBonus = sponsor.winBonus;

/* komplette Saison */

team.sponsorGamesLeft = 34;

/* Sofortzahlung */

team.balance += sponsor.payment;

/* Reputation erhöhen */

if(sponsor.reputation > team.sponsorReputation){
team.sponsorReputation = sponsor.reputation;
}

await team.save();

return team;

}

/* =====================================================
SIEG BONUS
===================================================== */

async function paySponsorWinBonus(team){

if(!team.sponsor) return;

if(!team.sponsorWinBonus) return;

team.balance += team.sponsorWinBonus;

await team.save();

}

/* =====================================================
SPIELTAG REDUZIEREN
===================================================== */

async function reduceSponsorGames(team){

if(!team.sponsor) return;

team.sponsorGamesLeft -= 1;

/* Sponsor läuft aus */

if(team.sponsorGamesLeft <= 0){

team.sponsor = null;
team.sponsorPayment = 0;
team.sponsorWinBonus = 0;
team.sponsorGamesLeft = 0;

console.log(`Sponsor Vertrag beendet: ${team.name}`);

}

await team.save();

}

module.exports = {

generateSponsorOffers,
acceptSponsor,
paySponsorWinBonus,
reduceSponsorGames

};