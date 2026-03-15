function applyTrainerTacticalProfile(ctx){

const dna = ctx.coachDNA || {}

const pressingHeight = dna.pressingHeight ?? 50
const defensiveLine = dna.defensiveLine ?? 50
const tempo = dna.possessionTempo ?? 50
const buildUp = dna.buildUpSpeed ?? 50
const width = dna.attackWidth ?? 50
const counterRisk = dna.counterRisk ?? 50

/* PRESSING */

ctx.pressModifier =
0.85 + (pressingHeight / 100) * 0.35

/* DEFENSIVE LINE */

if(defensiveLine > 70){
ctx.defensiveLineStyle = "high"
}
else if(defensiveLine < 35){
ctx.defensiveLineStyle = "low"
}
else{
ctx.defensiveLineStyle = "mid"
}

/* TEMPO */

ctx.tempoModifier =
0.85 + (tempo / 100) * 0.4

/* BUILD UP */

ctx.buildUpModifier =
0.9 + (buildUp / 100) * 0.35

/* WIDTH */

ctx.widthModifier =
0.85 + (width / 100) * 0.35

/* COUNTER RISK */

ctx.counterRisk =
0.8 + (counterRisk / 100) * 0.5

}

module.exports = { applyTrainerTacticalProfile }
