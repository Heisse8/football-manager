function applySecondBallChance(attackCtx, defendCtx){

let chance = 0.22

if(attackCtx.style === "longball") chance += 0.12
if(attackCtx.style === "counter") chance += 0.05

const duel =
attackCtx.attackStrength /
(attackCtx.attackStrength + defendCtx.defenseStrength)

chance *= duel

if(Math.random() > chance){
return false
}

return true
}

module.exports = { applySecondBallChance }