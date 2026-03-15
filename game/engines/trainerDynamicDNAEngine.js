function generateDynamicCoachDNA(ctx, coach){

const dna = {
tempo:1,
pressing:1,
width:1,
directness:1,
risk:1
}

/* =====================================
COACH RATING
===================================== */

const stars = coach?.stars || 3

dna.tempo += (stars - 3) * 0.05
dna.pressing += (stars - 3) * 0.05
dna.risk += (stars - 3) * 0.04

/* =====================================
PHILOSOPHY
===================================== */

switch(coach?.philosophy){

case "ballbesitz":
dna.tempo *= 0.9
dna.directness *= 0.8
dna.width *= 1.1
break

case "gegenpressing":
dna.pressing *= 1.25
dna.tempo *= 1.2
dna.risk *= 1.15
break

case "konter":
dna.directness *= 1.3
dna.tempo *= 1.15
dna.risk *= 1.1
break

case "defensiv":
dna.tempo *= 0.8
dna.pressing *= 0.9
dna.risk *= 0.85
break

}

/* =====================================
FORMATION
===================================== */

switch(ctx.formation){

case "4-3-3":
dna.width *= 1.15
break

case "3-5-2":
dna.directness *= 1.1
break

case "5-3-2":
dna.risk *= 0.85
break

case "4-2-3-1":
dna.tempo *= 1.05
break

}

/* =====================================
PLAYER PROFILE
===================================== */

let pace = 0
let passing = 0
let defending = 0

for(const p of ctx.players){

pace += p.pace || 50
passing += p.passing || 50
defending += p.defending || 50

}

const count = ctx.players.length || 1

pace /= count
passing /= count
defending /= count

dna.tempo *= 0.9 + pace/200
dna.directness *= 0.9 + pace/200
dna.width *= 0.9 + passing/200
dna.pressing *= 0.9 + defending/200

return dna

}

module.exports = { generateDynamicCoachDNA }
