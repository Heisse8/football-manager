function applyWingBackOverlap(attackCtx){

let overlapChance = 0.12

const wingbacks = attackCtx.players.filter(p =>
p.positions?.includes("LB") ||
p.positions?.includes("RB")
)

if(wingbacks.length === 0){
return 1
}

for(const wb of wingbacks){

if(wb.pace > 70) overlapChance += 0.04
if(wb.stamina > 70) overlapChance += 0.04

}

if(Math.random() < overlapChance){
return 1.18
}

return 1

}

module.exports = { applyWingBackOverlap }