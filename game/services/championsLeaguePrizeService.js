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
GRUPPENPHASE BONUS
===================================================== */

async function payGroupStage(team){

team.balance += prizes.groupStage;

await team.save();

}

/* =====================================================
GRUPPENSIEG
===================================================== */

async function payGroupWin(team){

team.balance += prizes.groupWin;

await team.save();

}

/* =====================================================
GRUPPEN UNENTSCHIEDEN
===================================================== */

async function payGroupDraw(team){

team.balance += prizes.groupDraw;

await team.save();

}

/* =====================================================
ACHTELFINALE
===================================================== */

async function payRound16(team){

team.balance += prizes.round16;

await team.save();

}

/* =====================================================
VIERTELFINALE
===================================================== */

async function payQuarter(team){

team.balance += prizes.quarter;

await team.save();

}

/* =====================================================
HALBFINALE
===================================================== */

async function paySemi(team){

team.balance += prizes.semi;

await team.save();

}

/* =====================================================
FINALE
===================================================== */

async function payFinal(team){

team.balance += prizes.final;

await team.save();

}

/* =====================================================
SIEGER BONUS
===================================================== */

async function payWinner(team){

team.balance += prizes.winner;

await team.save();

}

module.exports = {

payGroupStage,
payGroupWin,
payGroupDraw,

payRound16,
payQuarter,
paySemi,
payFinal,
payWinner

};