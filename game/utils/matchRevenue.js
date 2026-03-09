const Stadium = require("../models/Stadium");
const Team = require("../models/Team");
const Match = require("../models/Match");

async function generateMatchRevenue(teamId){

const team = await Team.findById(teamId);

const stadium = await Stadium.findOne({ team:teamId });

if(!team || !stadium) return;

/* ================= LETZTES MATCH ================= */

const match = await Match.findOne({
$or:[
{ homeTeam:teamId },
{ awayTeam:teamId }
],
played:true
}).sort({ date:-1 });

if(!match) return;

/* ================= NUR HEIMSPIELE ================= */

if(match.homeTeam.toString() !== teamId.toString()){
return;
}

/* ================= GEGNER ================= */

const opponent = await Team.findById(match.awayTeam);

let teamWon = match.homeGoals > match.awayGoals;

/* ================= BASIS NACHFRAGE ================= */

let demand = team.fanBase * 4500;

/* ================= TABELLENFAKTOR ================= */

let tableFactor = 1;

if(team.tablePosition){
tableFactor = 1 + ((18 - team.tablePosition) * 0.03);
}

/* ================= GEGNERFAKTOR ================= */

let opponentFactor = 1;

if(opponent && opponent.tablePosition){
opponentFactor = 1 + ((18 - opponent.tablePosition) * 0.02);
}

/* ================= TICKETPREIS ================= */

let priceFactor = 1 - (stadium.ticketPrice / 80);

priceFactor = Math.max(0.2, priceFactor);

/* ================= STADION FEATURES ================= */

const comfort = stadium.fanComfort || 1;
const atmosphere = stadium.atmosphere || 1;

/* ================= ZUSCHAUER ================= */

let attendance =
demand *
tableFactor *
opponentFactor *
priceFactor *
comfort *
atmosphere;

attendance = Math.min(stadium.capacity, attendance);
attendance = Math.max(500, attendance);

attendance = Math.round(attendance);

/* ================= EINNAHMEN ================= */

let revenue =
attendance *
stadium.ticketPrice *
1.05;

/* ================= SIEG BONUS ================= */

if(team.sponsorWinBonus && teamWon){
revenue += team.sponsorWinBonus;
}

/* ================= SPEICHERN ================= */

team.balance += revenue;

team.lastMatchRevenue = revenue;
team.lastAttendance = attendance;

/* ================= HEIMBONUS ================= */

const fillRate = attendance / stadium.capacity;

team.homeBonus = 1 + (fillRate * 0.15);

await team.save();

}

module.exports = { generateMatchRevenue };