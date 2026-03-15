function applyDynamicTempo(state, ctx){

let modifier = 1

const isHome = ctx === state.homeCtx

const goalsFor = isHome ? state.home.goals : state.away.goals
const goalsAgainst = isHome ? state.away.goals : state.home.goals

// Rückstand → schneller
if(goalsFor < goalsAgainst){
modifier *= 1.15
}

// Führung → langsamer
if(goalsFor > goalsAgainst){
modifier *= 0.90
}

// späte Phase
if(state.minute > 75){
modifier *= 1.10
}

// Chaosphase
if(state.rhythm?.phase === "chaos"){
modifier *= 1.20
}

return modifier

}

module.exports = { applyDynamicTempo }