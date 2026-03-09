const Team = require("../models/Team");

/* =====================================================
 UEFA PRIZE MONEY
===================================================== */

const prizes = {

groupStage: 15000000,

groupWin: 2000000,
groupDraw: 1000000,

round16: 9000000,

quarter: 12000000,

semi: 15000000,

final: 20000000,

winner: 30000000

};

/* =====================================================
 GENERIC PRIZE FUNCTION
===================================================== */

async function payPrize(team, type){

if(!team) return;

const amount = prizes[type] || 0;

team.balance += amount;

await team.save();

console.log(`💰 UEFA Prize: ${team.name} +${amount}`);

}

/* =====================================================
 EXPORTS
===================================================== */

module.exports = {

payGroupStage: (team) => payPrize(team,"groupStage"),

payGroupWin: (team) => payPrize(team,"groupWin"),

payGroupDraw: (team) => payPrize(team,"groupDraw"),

payRound16: (team) => payPrize(team,"round16"),

payQuarter: (team) => payPrize(team,"quarter"),

paySemi: (team) => payPrize(team,"semi"),

payFinal: (team) => payPrize(team,"final"),

payWinner: (team) => payPrize(team,"winner")

};