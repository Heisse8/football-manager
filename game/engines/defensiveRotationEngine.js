function applyDefensiveRotation(defendCtx, zone){

let modifier = 1

// Verteidigung verschiebt sich gut
if(zone === "wing_left" || zone === "wing_right"){

const fullbacks = defendCtx.players.filter(p =>
p.positions?.includes("LB") ||
p.positions?.includes("RB")
)

if(fullbacks.length >= 2){
modifier = 0.90
}

}

// Zentrum schwerer zu verteidigen
if(zone === "center"){
modifier = 1.10
}

// Konter → Rotation bricht
if(defendCtx.style === "counter"){
modifier *= 1.12
}

return modifier

}

module.exports = { applyDefensiveRotation }