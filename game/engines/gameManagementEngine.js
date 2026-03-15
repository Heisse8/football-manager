function applyGameManagement(state, ctx){

let tempoModifier = 1

const isHome = ctx === state.homeCtx

const goalsFor = isHome ? state.home.goals : state.away.goals
const goalsAgainst = isHome ? state.away.goals : state.home.goals

if(goalsFor > goalsAgainst){

// Zeitspiel
if(state.minute > 70){
tempoModifier *= 0.85
}

if(state.minute > 80){
tempoModifier *= 0.75
}

}

return tempoModifier

}

module.exports = { applyGameManagement }