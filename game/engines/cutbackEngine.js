function applyCutbackChance(zone, creator, attackCtx){

// Cutbacks passieren fast nur auf dem Flügel
if(zone !== "wing_left" && zone !== "wing_right"){
return {
isCutback:false,
xGModifier:1
}
}

let chance = 0.18

// schnelle Winger erzeugen mehr Cutbacks
if(creator?.pace > 70) chance += 0.05

// gute Dribbler kommen öfter zur Grundlinie
if(creator?.dribbling > 70) chance += 0.05

// moderne Systeme
if(attackCtx.style === "possession") chance += 0.04
if(attackCtx.style === "gegenpress") chance += 0.03

if(Math.random() > chance){
return {
isCutback:false,
xGModifier:1
}
}

return {
isCutback:true,
xGModifier:1.35
}

}

module.exports = { applyCutbackChance }