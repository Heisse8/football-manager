function applyFormationShift(state, ctx){

const minute = state.minute

const isHome = ctx === state.homeCtx

const goalsFor = isHome ? state.home.goals : state.away.goals
const goalsAgainst = isHome ? state.away.goals : state.home.goals

const diff = goalsFor - goalsAgainst

let formation = ctx.formation

/* =====================================
ALL-IN MODE
===================================== */

if(minute > 75 && diff < 0){

if(formation === "4-3-3") formation = "3-4-3"
if(formation === "4-4-2") formation = "4-2-4"
if(formation === "4-2-3-1") formation = "3-4-3"

}

/* =====================================
DEFENSIVE LOCKDOWN
===================================== */

if(minute > 75 && diff > 0){

if(formation === "4-3-3") formation = "5-4-1"
if(formation === "4-2-3-1") formation = "5-4-1"
if(formation === "4-4-2") formation = "5-3-2"

}

/* =====================================
LAST MINUTE CHAOS
===================================== */

if(minute > 88 && diff < 0){

formation = "2-4-4"

}

/* =====================================
APPLY EFFECT
===================================== */

applyFormationModifiers(ctx, formation)

}

function applyFormationModifiers(ctx, formation){

switch(formation){

case "3-4-3":
ctx.attackStrength *= 1.10
ctx.defenseStrength *= 0.92
break

case "4-2-4":
ctx.attackStrength *= 1.18
ctx.defenseStrength *= 0.85
break

case "2-4-4":
ctx.attackStrength *= 1.30
ctx.defenseStrength *= 0.70
break

case "5-4-1":
ctx.attackStrength *= 0.85
ctx.defenseStrength *= 1.18
break

case "5-3-2":
ctx.attackStrength *= 0.90
ctx.defenseStrength *= 1.15
break

}

ctx.currentFormation = formation

}

module.exports = { applyFormationShift }