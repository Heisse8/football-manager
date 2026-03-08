const Team = require("../models/Team");

/* =====================================================
ECONOMY BALANCER
Verhindert Geldinflation
===================================================== */

async function balanceEconomy(){

const teams = await Team.find();

for(const team of teams){

/* ================= SOFT CAP ================= */

const maxBalance = 250000000; // 250 Mio

if(team.balance > maxBalance){

const tax = (team.balance - maxBalance) * 0.30;

team.balance -= tax;

}

/* ================= FINANCIAL FAIR PLAY ================= */

if(team.balance > 100000000){

team.balance -= team.balance * 0.02;

}

/* ================= NEGATIVE BALANCE SCHUTZ ================= */

if(team.balance < -5000000){

team.balance = -5000000;

}

await team.save();

}

console.log("Economy Balancer ausgeführt");

}

module.exports = { balanceEconomy };