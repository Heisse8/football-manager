const Team = require("../models/Team");

/* =====================================================
 ECONOMY BALANCER
 verhindert Geldinflation
===================================================== */

async function balanceEconomy(){

const teams = await Team.find();

for(const team of teams){

let changed = false;

/* =====================================================
 SOFT CAP
===================================================== */

const maxBalance = 250000000; // 250 Mio

if(team.balance > maxBalance){

const tax = (team.balance - maxBalance) * 0.30;

team.balance -= tax;

console.log(`💰 Luxury Tax: ${team.name} -${Math.floor(tax)}`);

changed = true;

}

/* =====================================================
 FINANCIAL FAIR PLAY
===================================================== */

if(team.balance > 100000000){

const fee = team.balance * 0.02;

team.balance -= fee;

console.log(`📉 FFP Fee: ${team.name} -${Math.floor(fee)}`);

changed = true;

}

/* =====================================================
 NEGATIVE BALANCE SCHUTZ
===================================================== */

if(team.balance < -5000000){

team.balance = -5000000;

console.log(`🚫 Debt Limit: ${team.name}`);

changed = true;

}

/* =====================================================
 SPEICHERN
===================================================== */

if(changed){
await team.save();
}

}

console.log("🏦 Economy Balancer abgeschlossen");

}

module.exports = { balanceEconomy };