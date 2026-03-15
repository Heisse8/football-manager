function applyOffsideTrap(defendCtx, chanceType){

if(defendCtx.defensiveLine !== "high"){
return false
}

let offsideChance = 0.16

// Through Balls sind riskanter
if(chanceType === "through_ball"){
offsideChance += 0.12
}

// schnelle Stürmer laufen öfter ins Abseits
if(Math.random() < 0.2){
offsideChance += 0.05
}

return Math.random() < offsideChance

}

module.exports = { applyOffsideTrap }