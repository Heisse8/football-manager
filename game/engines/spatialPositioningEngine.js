// ======================================================
// SPATIAL POSITIONING ENGINE
// ======================================================

const PITCH_LENGTH = 100
const PITCH_WIDTH = 68

function initializePlayerPositions(teamCtx,isHome){

const positions = {}

for(const p of teamCtx.players){

let x = 50
let y = 34

if(p.positions?.includes("GK")){
x = isHome ? 5 : 95
y = 34
}

if(p.positions?.includes("CB")){
x = isHome ? 18 : 82
y = 25 + Math.random()*18
}

if(p.positions?.includes("LB")){
x = isHome ? 20 : 80
y = 10
}

if(p.positions?.includes("RB")){
x = isHome ? 20 : 80
y = 58
}

if(p.positions?.includes("CM")){
x = 40 + Math.random()*20
y = 25 + Math.random()*18
}

if(p.positions?.includes("CAM")){
x = isHome ? 60 : 40
y = 34
}

if(p.positions?.includes("LW")){
x = isHome ? 65 : 35
y = 10
}

if(p.positions?.includes("RW")){
x = isHome ? 65 : 35
y = 58
}

if(p.positions?.includes("ST")){
x = isHome ? 80 : 20
y = 34
}

positions[p._id] = {x,y}

}

teamCtx.positions = positions

}

function movePlayers(teamCtx,state){

for(const id in teamCtx.positions){

const pos = teamCtx.positions[id]

let dx = (Math.random()-0.5) * 6
let dy = (Math.random()-0.5) * 4

if(state.rhythm?.phase === "home_pressure"){
dx += 2
}

if(state.rhythm?.phase === "away_pressure"){
dx -= 2
}

pos.x = clamp(pos.x + dx,0,PITCH_LENGTH)
pos.y = clamp(pos.y + dy,0,PITCH_WIDTH)

}

}

function calculatePassPressure(receiver, defendCtx){

let pressure = 0

for(const id in defendCtx.positions){

const d = defendCtx.positions[id]

const dx = receiver.x - d.x
const dy = receiver.y - d.y

const dist = Math.sqrt(dx*dx + dy*dy)

if(dist < 10){
pressure += 0.15
}

}

return 1 + pressure

}

function passingLaneBlocked(p1,p2,defendCtx){

for(const id in defendCtx.positions){

const d = defendCtx.positions[id]

const dist = pointLineDistance(
d,
p1,
p2
)

if(dist < 3){
return true
}

}

return false

}

function pointLineDistance(p, a, b){

const A = p.x - a.x
const B = p.y - a.y
const C = b.x - a.x
const D = b.y - a.y

const dot = A * C + B * D
const len = C * C + D * D

let param = -1

if(len !== 0){
param = dot / len
}

let xx,yy

if(param < 0){
xx = a.x
yy = a.y
}
else if(param > 1){
xx = b.x
yy = b.y
}
else{
xx = a.x + param * C
yy = a.y + param * D
}

const dx = p.x - xx
const dy = p.y - yy

return Math.sqrt(dx*dx + dy*dy)

}

function clamp(v,min,max){
return Math.max(min,Math.min(max,v))
}

module.exports = {
initializePlayerPositions,
movePlayers,
calculatePassPressure,
passingLaneBlocked
}