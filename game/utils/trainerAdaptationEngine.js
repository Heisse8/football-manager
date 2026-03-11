function applyTrainerAdaptation(state, ctx, opponentCtx, coach){

if(!coach) return;

const teamState = ctx === state.home ? state.home : state.away;
const oppState = ctx === state.home ? state.away : state.home;

const minute = state.minute;

let adaptation = 1;

/* =====================================
LIEGT ZURÜCK
===================================== */

if(teamState.goals < oppState.goals){

if(minute > 60){

adaptation += 0.15;

ctx.attackStrength *= 1.10;
ctx.defenseStrength *= 0.95;

}

}

/* =====================================
FÜHRT
===================================== */

if(teamState.goals > oppState.goals){

if(minute > 70){

ctx.defenseStrength *= 1.12;
ctx.attackStrength *= 0.95;

}

}

/* =====================================
STAR TRAINER ADAPTIEREN BESSER
===================================== */

if(coach.stars >= 4.5){

adaptation += 0.10;

}

/* =====================================
PERSONALITY BONUS
===================================== */

if(coach.personality === "tactical_genius"){

adaptation += 0.15;

}

ctx.attackStrength *= adaptation;
ctx.defenseStrength *= adaptation;

}

module.exports = { applyTrainerAdaptation };