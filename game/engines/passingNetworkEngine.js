function applyDynamicPassingNetwork(ctx){

if(!ctx.players) return

ctx.passNetwork = {}

for(const passer of ctx.players){

ctx.passNetwork[passer._id] = {}

for(const receiver of ctx.players){

if(passer._id === receiver._id) continue

let weight = 1

// Positionslogik
if(
passer.positions?.includes("CM") ||
passer.positions?.includes("CAM")
){
weight += 2
}

if(
receiver.positions?.includes("ST") ||
receiver.positions?.includes("LW") ||
receiver.positions?.includes("RW")
){
weight += 2
}

ctx.passNetwork[passer._id][receiver._id] = weight

}

}

}

function choosePassTarget(passer, ctx){

if(!passer || !passer._id) return null
if(!ctx.passNetwork) return null
if(!ctx.players || ctx.players.length === 0) return null

const network = ctx.passNetwork[passer._id]

if(!network) return null

const targets = []
let totalWeight = 0

for(const player of ctx.players){

if(!player || !player._id) continue

// ObjectId Vergleich korrekt
if(player._id.toString() === passer._id.toString()) continue

const weight = network[player._id] || 1

targets.push({
player,
weight
})

totalWeight += weight

}

if(targets.length === 0) return null

let r = Math.random() * totalWeight

for(const t of targets){

if(r < t.weight) return t.player
r -= t.weight

}

return targets[0].player

}


module.exports = {
applyDynamicPassingNetwork,
choosePassTarget
}