function applyDynamicTacticalAdjustments(state, ctx, opponentCtx){

const isHome = ctx === state.homeCtx

const goalsFor = isHome ? state.home.goals : state.away.goals
const goalsAgainst = isHome ? state.away.goals : state.home.goals

const diff = goalsFor - goalsAgainst

const minute = state.minute

let risk = ctx.coachDNA.risk || 1
let pressing = ctx.coachDNA.pressing || 1
let tempo = ctx.coachDNA.tempo || 1

/* =====================================
RÜCKSTAND → mehr Risiko
===================================== */

if(diff < 0){

risk *= 1.15
pressing *= 1.10
tempo *= 1.10

}

/* =====================================
FÜHRUNG → Spiel kontrollieren
===================================== */

if(diff > 0){

risk *= 0.92
pressing *= 0.95
tempo *= 0.90

}

/* =====================================
SPÄTE SPIELPHASE
===================================== */

if(minute > 75 && diff <= 0){

risk *= 1.20
tempo *= 1.15

}

/* =====================================
LETZTE MINUTEN ALL‑IN
===================================== */

if(minute > 85 && diff < 0){

risk *= 1.35
pressing *= 1.25
tempo *= 1.20

}

/* =====================================
MOMENTUM REACTION
===================================== */

const momentum =
isHome ? state.momentum.home : state.momentum.away

if(momentum > 0.2){

tempo *= 1.08
pressing *= 1.05

}

if(momentum < -0.2){

risk *= 1.10

}

/* =====================================
RHYTHM ADAPTATION
===================================== */

if(state.rhythm.phase === "counter_phase"){

risk *= 1.10

}

if(state.rhythm.phase === "chaos"){

tempo *= 1.15

}

/* =====================================
LIMITER
===================================== */

ctx.coachDNA.risk = clamp(risk,0.75,1.6)
ctx.coachDNA.pressing = clamp(pressing,0.75,1.6)
ctx.coachDNA.tempo = clamp(tempo,0.70,1.6)

}

function clamp(v,min,max){
return Math.max(min,Math.min(max,v))
}

module.exports = { applyDynamicTacticalAdjustments }