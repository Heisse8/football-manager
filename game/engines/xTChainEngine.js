function runXTChain(state, attackCtx, defendCtx){

let xT = 0
let zone = chooseStartZone()

let steps = 2 + Math.floor(Math.random()*4)

for(let i=0;i<steps;i++){

const action = chooseXTAction()

const delta = calculateXTGain(zone, action)

xT += delta

zone = nextZone(zone, action)

if(xT > 0.28){
return {
success:true,
zone,
xT
}
}

if(xT < -0.05){
return { success:false }
}

}

return { success:false }

}

function chooseXTAction(){

const r = Math.random()

if(r < 0.55) return "pass"
if(r < 0.80) return "dribble"
return "cross"

}

function calculateXTGain(zone, action){

const base = {

wing_left:0.03,
wing_right:0.03,
halfspace_left:0.06,
halfspace_right:0.06,
center:0.08

}

let gain = base[zone] || 0.02

if(action === "dribble") gain *= 1.3
if(action === "cross") gain *= 0.9

return gain

}

function nextZone(zone){

const transitions = {

wing_left:["halfspace_left","center"],
wing_right:["halfspace_right","center"],
halfspace_left:["center","close"],
halfspace_right:["center","close"],
center:["close"]

}

const options = transitions[zone] || ["center"]

return options[Math.floor(Math.random()*options.length)]

}

function chooseStartZone(){

const zones = [
"wing_left",
"wing_right",
"halfspace_left",
"halfspace_right",
"center"
]

return zones[Math.floor(Math.random()*zones.length)]

}

module.exports = { runXTChain }