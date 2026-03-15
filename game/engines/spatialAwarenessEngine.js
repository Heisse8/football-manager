function applySpatialAwareness(player, attackCtx, defendCtx){

let vision = player?.mentality || 50
let positioning = player?.positioning || 50

let awareness = (vision*0.6 + positioning*0.4) / 100

let modifier = 1

// viele Verteidiger → Raum kleiner
const defenders = defendCtx.players.filter(p =>
p.positions?.includes("CB") ||
p.positions?.includes("LB") ||
p.positions?.includes("RB") ||
p.positions?.includes("CDM")
)

let density = defenders.length

if(density >= 5){
modifier *= 0.85
}

if(density <= 3){
modifier *= 1.20
}

// intelligente Spieler finden Räume
modifier *= (0.9 + awareness*0.3)

return modifier

}

module.exports = { applySpatialAwareness }