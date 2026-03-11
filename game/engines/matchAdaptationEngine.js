function applyMatchAdaptation(state, ctx, opponentCtx){

const scoreDiff =
ctx === state.homeCtx
? state.home.goals - state.away.goals
: state.away.goals - state.home.goals;

const minute = state.minute;

/* ======================================================
 TEAM LIEGT HINTEN
====================================================== */

if(scoreDiff < 0){

if(minute > 60){

ctx.attackStrength *= 1.10;
ctx.defenseStrength *= 0.94;
ctx.possessionSkill *= 1.05;

}

if(minute > 75){

ctx.attackStrength *= 1.18;
ctx.defenseStrength *= 0.90;

}

}

/* ======================================================
 TEAM FÜHRT
====================================================== */

if(scoreDiff > 0){

if(minute > 70){

ctx.attackStrength *= 0.92;
ctx.defenseStrength *= 1.08;

}

if(minute > 80){

ctx.attackStrength *= 0.85;
ctx.defenseStrength *= 1.12;

}

}

/* ======================================================
 UNENTSCHIEDEN
====================================================== */

if(scoreDiff === 0){

if(minute > 75){

ctx.attackStrength *= 1.05;

}

}

}

module.exports = { applyMatchAdaptation };