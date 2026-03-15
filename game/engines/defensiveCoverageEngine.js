function applyDefensiveCoverage(defendCtx){

let defenders = defendCtx.players.filter(p =>
p.positions?.includes("CB") ||
p.positions?.includes("LB") ||
p.positions?.includes("RB") ||
p.positions?.includes("CDM")
)

let coverage = defenders.length

let modifier = 1

// viele Verteidiger im Raum
if(coverage >= 5){
modifier = 0.80
}

// normale Verteidigung
else if(coverage === 4){
modifier = 0.92
}

// wenige Verteidiger (Konter)
else if(coverage <= 3){
modifier = 1.20
}

return modifier

}

module.exports = { applyDefensiveCoverage }