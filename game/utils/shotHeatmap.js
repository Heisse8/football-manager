function generateShotHeatmap(results){

const gridWidth = 12
const gridHeight = 8

const heatmap = []

for(let y=0;y<gridHeight;y++){
heatmap[y] = []
for(let x=0;x<gridWidth;x++){
heatmap[y][x] = 0
}
}

for(const match of results){

for(const side of ["home","away"]){

const shots = match.shotMap?.[side] || []

for(const shot of shots){

if(typeof shot.x !== "number" || typeof shot.y !== "number"){
continue
}

const gx = Math.min(gridWidth-1, Math.floor(shot.x * gridWidth))
const gy = Math.min(gridHeight-1, Math.floor(shot.y * gridHeight))

heatmap[gy][gx]++

}

}

}

console.log("\n========== SHOT HEATMAP ==========\n")

for(let y=0;y<gridHeight;y++){

let row = ""

for(let x=0;x<gridWidth;x++){

const v = heatmap[y][x]

if(v > 500) row += "██"
else if(v > 250) row += "▓▓"
else if(v > 120) row += "▒▒"
else if(v > 40) row += "░░"
else row += "  "

}

console.log(row)

}

console.log("\n==================================\n")

}

module.exports = { generateShotHeatmap }