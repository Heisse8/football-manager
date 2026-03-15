function applyBlockingPosition(defender, zone){

let blockChance = 0.10

if(defender?.positions?.includes("CB")){
blockChance += 0.08
}

if(defender?.positions?.includes("CDM")){
blockChance += 0.06
}

// Zentrum wird stärker geblockt
if(zone === "center"){
blockChance += 0.06
}

// Halbräume moderat
if(zone === "halfspace_left" || zone === "halfspace_right"){
blockChance += 0.03
}

return blockChance

}

module.exports = { applyBlockingPosition }