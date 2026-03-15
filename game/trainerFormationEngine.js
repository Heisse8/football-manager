function chooseTrainerFormation(team, coach){

const players = team.players || []

if(players.length === 0){
return coach?.preferredFormation || "4-4-2"
}

const preferred = coach?.preferredFormation || "4-4-2"

/* ======================================================
 KADER ANALYSE
====================================================== */

let ST = 0
let WINGER = 0
let CM = 0
let CDM = 0
let CAM = 0
let CB = 0
let FB = 0

for(const p of players){

if(p.positions?.includes("ST")) ST++

if(
p.positions?.includes("LW") ||
p.positions?.includes("RW")
) WINGER++

if(p.positions?.includes("CM")) CM++

if(p.positions?.includes("CDM")) CDM++

if(p.positions?.includes("CAM")) CAM++

if(p.positions?.includes("CB")) CB++

if(
p.positions?.includes("LB") ||
p.positions?.includes("RB")
) FB++

}

/* ======================================================
 FORMATION SCORE
====================================================== */

function scoreFormation(name){

let score = 0

switch(name){

case "4-3-3":

score += Math.min(WINGER,2) * 3
score += Math.min(ST,1) * 2
score += Math.min(CM + CAM,3)
score += Math.min(CB,2)
score += Math.min(FB,2)

break

case "4-2-3-1":

score += Math.min(WINGER,2) * 2
score += Math.min(ST,1) * 2
score += Math.min(CDM,2) * 2
score += Math.min(CAM,1) * 2
score += Math.min(CB,2)
score += Math.min(FB,2)

break

case "4-4-2":

score += Math.min(ST,2) * 3
score += Math.min(WINGER,2)
score += Math.min(CM,2)
score += Math.min(CB,2)
score += Math.min(FB,2)

break

case "3-5-2":

score += Math.min(ST,2) * 3
score += Math.min(CM + CAM,3)
score += Math.min(CB,3)
score += Math.min(WINGER,2)

break

case "3-4-3":

score += Math.min(WINGER,2) * 3
score += Math.min(ST,1) * 2
score += Math.min(CM,2)
score += Math.min(CB,3)

break

default:
score = 1

}

return score

}

/* ======================================================
 KANDIDATEN
====================================================== */

const formations = [

preferred,

"4-3-3",
"4-2-3-1",
"4-4-2",
"3-5-2",
"3-4-3"

]

let bestFormation = preferred
let bestScore = scoreFormation(preferred)

/* ======================================================
 BESTE FORMATION FINDEN
====================================================== */

for(const f of formations){

const s = scoreFormation(f)

if(s > bestScore){

bestScore = s
bestFormation = f

}

}

return bestFormation

}

module.exports = { chooseTrainerFormation }
