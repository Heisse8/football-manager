// ======================================================
// DYNAMIC DEFENSIVE BLOCK ENGINE
// Bestimmt Pressinghöhe und Kompaktheit
// ======================================================

function applyDefensiveBlock(ctx, state){

const dna = ctx.coachDNA || {}

let block = "mid"

// aggressives Pressing
if(dna.pressing > 1.1 && dna.tempo > 1.05){
block = "high"
}

// sehr defensiv
if(dna.risk < 0.9){
block = "low"
}

// Spielstand berücksichtigen
const isHome = ctx === state.homeCtx

const goalsFor = isHome ? state.home.goals : state.away.goals
const goalsAgainst = isHome ? state.away.goals : state.home.goals

const diff = goalsFor - goalsAgainst

// Führung sichern
if(diff > 0 && state.minute > 60){
block = "low"
}

// Rückstand → höher pressen
if(diff < 0 && state.minute > 60){
block = "high"
}

ctx.defensiveBlock = block

ctx.blockModifier = {
progress:1,
press:1,
compactness:1
}

switch(block){

case "high":

ctx.blockModifier.progress = 0.9
ctx.blockModifier.press = 1.25
ctx.blockModifier.compactness = 0.95

break

case "mid":

ctx.blockModifier.progress = 1
ctx.blockModifier.press = 1
ctx.blockModifier.compactness = 1

break

case "low":

ctx.blockModifier.progress = 1.15
ctx.blockModifier.press = 0.85
ctx.blockModifier.compactness = 1.15

break

}

}

module.exports = { applyDefensiveBlock }