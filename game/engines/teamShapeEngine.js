// ======================================================
// TEAM SHAPE ENGINE
// Angriffsstaffelung + Restverteidigung
// ======================================================

function applyTeamShape(ctx){

const dna = ctx.coachDNA || {}

ctx.shape = {
attackers:4,
midfield:3,
restDefense:3
}

// offensiver Trainer
if(dna.tempo > 1.1 || dna.risk > 1.1){

ctx.shape.attackers = 5
ctx.shape.midfield = 3
ctx.shape.restDefense = 2

}

// Ballbesitztrainer (Guardiola Style)
if(dna.directness < 0.9){

ctx.shape.attackers = 5
ctx.shape.midfield = 2
ctx.shape.restDefense = 3

}

// defensiver Trainer (Simeone)
if(dna.risk < 0.9){

ctx.shape.attackers = 2
ctx.shape.midfield = 4
ctx.shape.restDefense = 4

}

}

module.exports = { applyTeamShape }