function chooseFormation(team, coach){

if(!team){
return coach?.preferredFormation || "4-4-2"
}

const players = team.players || []


/* =====================================
FORMATIONEN DIE TRAINER KANN
===================================== */

const possibleFormations = coach?.formations || [
"4-4-2",
"4-2-3-1",
"4-3-3",
"3-5-2",
"3-4-3",
"3-4-2-1",
"5-3-2"
]

let bestFormation = coach?.preferredFormation || possibleFormations[0]
let bestScore = -Infinity

for(const formation of possibleFormations){

const score = evaluateFormation(players, formation)

if(score > bestScore){

bestScore = score
bestFormation = formation

}

}

return bestFormation

}

/* =====================================
FORMATION SCORE
===================================== */

function evaluateFormation(players, formation){

const counts = {

CB:0,
FB:0,
WB:0,
CM:0,
DM:0,
AM:0,
W:0,
ST:0

}

for(const p of players){

const pos = p.positions || []

if(pos.includes("CB")) counts.CB++
if(pos.includes("LB") || pos.includes("RB")) counts.FB++
if(pos.includes("LWB") || pos.includes("RWB")) counts.WB++
if(pos.includes("CM")) counts.CM++
if(pos.includes("CDM")) counts.DM++
if(pos.includes("CAM")) counts.AM++
if(pos.includes("LW") || pos.includes("RW")) counts.W++
if(pos.includes("ST")) counts.ST++

}

let score = 0

switch(formation){

case "4-3-3":

score += counts.CB * 2
score += counts.FB * 1.5
score += counts.CM * 2
score += counts.W * 2
score += counts.ST * 1.5

break

case "4-2-3-1":

score += counts.CB * 2
score += counts.FB * 1.5
score += counts.DM * 2
score += counts.AM * 2
score += counts.ST * 1.5

break

case "3-5-2":

score += counts.CB * 3
score += counts.WB * 2
score += counts.CM * 2
score += counts.ST * 2

break

case "3-4-3":

score += counts.CB * 3
score += counts.WB * 2
score += counts.W * 2
score += counts.ST * 1

break

case "3-4-2-1":

score += counts.CB * 3
score += counts.WB * 2
score += counts.AM * 2
score += counts.ST * 1

break

case "5-3-2":

score += counts.CB * 3
score += counts.WB * 2
score += counts.CM * 2
score += counts.ST * 2

break

case "4-4-2":

score += counts.CB * 2
score += counts.FB * 1.5
score += counts.CM * 2
score += counts.ST * 2

break

}

return score

}

module.exports = { chooseFormation }
