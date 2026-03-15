function applyTrainerGameManagement(state, ctx, coach){

if(!coach) return

const isHome = ctx === state.homeCtx

const goalsFor = isHome ? state.home.goals : state.away.goals
const goalsAgainst = isHome ? state.away.goals : state.home.goals

const diff = goalsFor - goalsAgainst

const dna = ctx.dynamicDNA || ctx.coachDNA || {}

ctx.gamePlan = ctx.gamePlan || {
tempo:1,
pressing:1,
risk:1,
width:1
}

/* =====================================
TEAM LIEGT ZURÜCK
===================================== */

if(diff < 0){

ctx.gamePlan.risk *= 1.15
ctx.gamePlan.tempo *= 1.10

if(state.minute > 70){

ctx.gamePlan.risk *= 1.25
ctx.gamePlan.tempo *= 1.15
ctx.gamePlan.pressing *= 1.10

}

}

/* =====================================
TEAM FÜHRT
===================================== */

if(diff > 0){

ctx.gamePlan.risk *= 0.90
ctx.gamePlan.tempo *= 0.92

if(state.minute > 75){

ctx.gamePlan.risk *= 0.80
ctx.gamePlan.tempo *= 0.85
ctx.gamePlan.pressing *= 0.90

}

}

/* =====================================
SPIELSTIL EINFLUSS
===================================== */

switch(coach.philosophy){

case "gegenpressing":

ctx.gamePlan.pressing *= 1.10
ctx.gamePlan.tempo *= 1.05
break

case "ballbesitz":

ctx.gamePlan.tempo *= 0.90
ctx.gamePlan.width *= 1.10
break

case "konter":

ctx.gamePlan.risk *= 1.05
ctx.gamePlan.tempo *= 1.10
break

case "defensiv":

ctx.gamePlan.risk *= 0.85
ctx.gamePlan.pressing *= 0.90
break

}

}
module.exports = { applyTrainerGameManagement }
