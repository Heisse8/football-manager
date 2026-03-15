// ======================================================
// POSSESSION STRUCTURE ENGINE
// Trainer beeinflussen Aufbau und Ballzirkulation
// ======================================================

function applyPossessionStructure(ctx){

const dna = ctx.coachDNA || {}

ctx.structure = {
passBias:1,
dribbleBias:1,
crossBias:1,
verticality:1
}

// Guardiola Style
if(dna.directness < 0.9){

ctx.structure.passBias = 1.35
ctx.structure.dribbleBias = 0.85
ctx.structure.verticality = 0.75

}

// Klopp Style
if(dna.tempo > 1.1 && dna.directness > 1){

ctx.structure.passBias = 0.9
ctx.structure.dribbleBias = 1.25
ctx.structure.verticality = 1.35

}

// Simeone Style
if(dna.risk < 0.9){

ctx.structure.passBias = 0.85
ctx.structure.crossBias = 1.25
ctx.structure.verticality = 0.8

}

// Balanced
if(!ctx.structure.verticality){
ctx.structure.verticality = 1
}

}

module.exports = { applyPossessionStructure }