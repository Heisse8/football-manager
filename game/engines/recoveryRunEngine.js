function applyRecoveryRun(attacker, defender){

let paceDiff =
(attacker?.pace || 50) -
(defender?.pace || 50)

let recoveryChance = 0.18

// schneller Verteidiger
if(paceDiff < 0){
recoveryChance += 0.18
}

// sehr schneller Verteidiger
if(paceDiff < -10){
recoveryChance += 0.25
}

// schneller Angreifer
if(paceDiff > 10){
recoveryChance -= 0.10
}

if(Math.random() > recoveryChance){
return { recovered:false }
}

return {
recovered:true,
modifier:0.65
}

}

module.exports = { applyRecoveryRun }