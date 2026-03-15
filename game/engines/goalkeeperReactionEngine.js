function applyGoalkeeperReaction(goalkeeper){

let reflex = goalkeeper?.reflexes || 50
let anticipation = goalkeeper?.mentality || 50

let reaction = (reflex*0.7 + anticipation*0.3)/100

let modifier = 1

const r = Math.random()

// Weltklasse Parade
if(r < 0.12 * reaction){

modifier = 0.65

}

// gute Parade
else if(r < 0.30){

modifier = 0.80

}

// normale Reaktion
else if(r < 0.75){

modifier = 1

}

// zu spät reagiert
else{

modifier = 1.25

}

return modifier

}

module.exports = { applyGoalkeeperReaction }