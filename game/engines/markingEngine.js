function applyMarking(attacker, defendCtx){

let modifier = 1

const markers = defendCtx.players.filter(p =>
p.positions?.includes("CB") ||
p.positions?.includes("CDM")
)

if(markers.length === 0){
return modifier
}

const bestMarker = markers.sort(
(a,b)=>(b.defending||50)-(a.defending||50)
)[0]

// guter Verteidiger reduziert Chance
modifier *= 1 - ((bestMarker.defending || 50) / 400)

return Math.max(0.7, modifier)

}

module.exports = { applyMarking }