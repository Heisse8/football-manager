function applyKeeperPositioning(goalkeeper, shotZone){

let modifier = 1
let event = null

let positioning = goalkeeper?.positioning || 50
let anticipation = goalkeeper?.mentality || 50

let skill = (positioning*0.7 + anticipation*0.3) / 100

const r = Math.random()

// Keeper zu weit draußen
if(r < 0.06 * (1 - skill)){

modifier = 1.35
event = "keeper_out_of_position"

}

// Perfekte Position
else if(r < 0.40 + skill*0.3){

modifier = 0.85

}

// Keeper reagiert zu spät
else if(r < 0.55){

modifier = 1.15

}

return {
modifier,
event
}

}

module.exports = { applyKeeperPositioning }