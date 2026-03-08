const Stadium = require("../models/Stadium");
const Team = require("../models/Team");

async function generateMatchRevenue(teamId){

const team = await Team.findById(teamId);

const stadium = await Stadium.findOne({
team:teamId
});

if(!team || !stadium) return;

/* ================= ZUSCHAUER ================= */

let demand = team.fanBase * 4500;

/* Ticketpreis Einfluss */

let priceFactor = 1 - (stadium.ticketPrice / 80);

priceFactor = Math.max(0.2, priceFactor);

/* Stadion Komfort */

const comfort = stadium.fanComfort || 1;

/* Atmosphäre */

const atmosphere = stadium.atmosphere || 1;

let attendance =
demand *
priceFactor *
comfort *
atmosphere;

/* Stadionlimit */

attendance = Math.min(stadium.capacity, attendance);

/* Mindestwert */

attendance = Math.max(500, attendance);

attendance = Math.round(attendance);

/* ================= EINNAHMEN ================= */

const revenue =
attendance *
stadium.ticketPrice *
1.05;

/* ================= SPEICHERN ================= */

team.balance += revenue;

team.lastMatchRevenue = revenue;

await team.save();

/* ================= HEIMBONUS ================= */

const fillRate =
attendance / stadium.capacity;

team.homeBonus =
1 + (fillRate * 0.15);

await team.save();

}

module.exports = { generateMatchRevenue };