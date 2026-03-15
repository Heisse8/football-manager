function applyPlayerPersonality(player){

let profile = {
shootBias:1,
passBias:1,
dribbleBias:1,
crossBias:1
}

// selfish striker
if(player.playstyles?.includes("selfish")){
profile.shootBias *= 1.35
profile.passBias *= 0.75
}

// elite playmaker
if(player.playstyles?.includes("playmaker")){
profile.passBias *= 1.35
profile.shootBias *= 0.80
}

// risky dribbler
if(player.playstyles?.includes("dribbler")){
profile.dribbleBias *= 1.40
}

// wide crosser
if(player.playstyles?.includes("crosser")){
profile.crossBias *= 1.35
}

// cautious passer
if(player.playstyles?.includes("safe_pass")){
profile.passBias *= 1.20
profile.dribbleBias *= 0.75
}

// aggressive attacker
if(player.playstyles?.includes("aggressive")){
profile.shootBias *= 1.20
profile.dribbleBias *= 1.15
}

return profile
}

module.exports = { applyPlayerPersonality }