const Stadium = require("../models/Stadium");
const Team = require("../models/Team");
const Match = require("../models/Match");

async function generateMatchRevenue(teamId){

const team = await Team.findById(teamId);

const stadium = await Stadium.findOne({
team:teamId
});

if(!team || !stadium) return;

/* ================= MATCH LADEN ================= */

const match = await Match.findOne({
$or:[
{ homeTeam:teamId },
{ awayTeam:teamId }
],
played:true
}).sort({ date:-1 });

let opponent = null;
let teamWon = false;

if(match){

if(match.homeTeam.toString() === teamId.toString()){

opponent = await Team.findById(match.awayTeam);

if(match.homeGoals > match.awayGoals){
teamWon = true;
}

}else{

opponent = await Team.findById(match.homeTeam);

if(match.awayGoals > match.homeGoals){
teamWon = true;
}

}

}

/* ================= ZUSCHAUER BASIS ================= */

let demand = team.fanBase * 4500;

/* ================= TABELLENPLATZ HEIMTEAM ================= */

let tableFactor = 1;

if(team.tablePosition){
tableFactor = 1 + ((18 - team.tablePosition) * 0.03);
}

/* ================= TABELLENPLATZ GEGNER ================= */

let opponentFactor = 1;

if(opponent && opponent.tablePosition){
opponentFactor = 1 + ((18 - opponent.tablePosition) * 0.02);
}

/* ================= TICKETPREIS ================= */

let priceFactor = 1 - (stadium.ticketPrice / 80);

priceFactor = Math.max(0.2, priceFactor);

/* ================= STADION KOMFORT ================= */

const comfort = stadium.fanComfort || 1;

/* ================= ATMOSPHÄRE ================= */

const atmosphere = stadium.atmosphere || 1;

/* ================= ZUSCHAUER ================= */

let attendance =
demand *
tableFactor *
opponentFactor *
priceFactor *
comfort *
atmosphere;

/* Stadionlimit */

attendance = Math.min(stadium.capacity, attendance);

/* Mindestinteresse */

attendance = Math.max(500, attendance);

attendance = Math.round(attendance);

/* ================= TICKET EINNAHMEN ================= */

let revenue =
attendance *
stadium.ticketPrice *
1.05;

/* ================= SPONSOR ZAHLUNG ================= */

if(team.sponsorPayment){

revenue += team.sponsorPayment;

}

/* ================= SPONSOR SIEG BONUS ================= */

if(team.sponsorWinBonus && teamWon){

revenue += team.sponsorWinBonus;

}

/* ================= SPEICHERN ================= */

team.balance += revenue;

team.lastMatchRevenue = revenue;
team.lastAttendance = attendance;

/* ================= HEIMBONUS ================= */

const fillRate =
attendance / stadium.capacity;

team.homeBonus =
1 + (fillRate * 0.15);

await team.save();

}

module.exports = { generateMatchRevenue };