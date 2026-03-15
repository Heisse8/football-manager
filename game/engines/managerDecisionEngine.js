// ======================================================
// MANAGER DECISION ENGINE
// Trainer passt Taktik dynamisch an
// ======================================================

function applyManagerDecisions(state, ctx, opponentCtx){

const dna = ctx.coachDNA || {}

const isHome = ctx === state.homeCtx

const goalsFor = isHome ? state.home.goals : state.away.goals
const goalsAgainst = isHome ? state.away.goals : state.home.goals

const diff = goalsFor - goalsAgainst

const minute = state.minute

/* ======================================
BASE RESET (jede Minute neu)
====================================== */

ctx.dynamicDNA = {
tempo: dna.tempo || 1,
pressing: dna.pressing || 1,
width: dna.width || 1,
directness: dna.directness || 1,
risk: dna.risk || 1
}

/* ======================================
RÜCKSTAND → OFFENSIVER
====================================== */

if(diff < 0){

ctx.dynamicDNA.tempo *= 1.15
ctx.dynamicDNA.pressing *= 1.10
ctx.dynamicDNA.directness *= 1.15
ctx.dynamicDNA.risk *= 1.20

}

/* ======================================
FÜHRUNG → KONTROLLE
====================================== */

if(diff > 0){

ctx.dynamicDNA.tempo *= 0.92
ctx.dynamicDNA.risk *= 0.88

}

/* ======================================
LETZTE 10 MINUTEN
====================================== */

if(minute > 80){

if(diff < 0){

ctx.dynamicDNA.tempo *= 1.25
ctx.dynamicDNA.pressing *= 1.20
ctx.dynamicDNA.risk *= 1.35

}

if(diff > 0){

ctx.dynamicDNA.tempo *= 0.80
ctx.dynamicDNA.pressing *= 0.85
ctx.dynamicDNA.directness *= 0.90

}

}

/* ======================================
MOMENTUM REACTION
====================================== */

const momentum = isHome ? state.momentum.home : state.momentum.away

if(momentum > 0.2){

ctx.dynamicDNA.risk *= 1.08
ctx.dynamicDNA.tempo *= 1.05

}

if(momentum < -0.2){

ctx.dynamicDNA.risk *= 0.92

}

}

module.exports = { applyManagerDecisions }