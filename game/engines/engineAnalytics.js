function printEngineAnalytics(results){

let totalShots = {}
let totalGoals = {}
let totalxG = {}

let chanceTypes = {}
let bodyParts = {}

let cutbacks = 0
let crosses = 0

for(const match of results){

const zones = match.zoneStats || {}

for(const z in zones.shots || {}){
totalShots[z] = (totalShots[z] || 0) + zones.shots[z]
}

for(const z in zones.goals || {}){
totalGoals[z] = (totalGoals[z] || 0) + zones.goals[z]
}

for(const z in zones.xG || {}){
totalxG[z] = (totalxG[z] || 0) + zones.xG[z]
}

/* EVENTS ANALYSIS */

for(const e of match.events || []){

if(e.type === "goal" || e.type === "big_chance"){

if(e.chanceType){
chanceTypes[e.chanceType] = (chanceTypes[e.chanceType] || 0) + 1
}

if(e.bodyPart){
bodyParts[e.bodyPart] = (bodyParts[e.bodyPart] || 0) + 1
}

}

if(e.type === "cutback"){
cutbacks++
}

if(e.type === "cross"){
crosses++
}

}

}

console.log("\n========== ENGINE ANALYTICS ==========\n")

console.log("Shots by zone")
console.table(totalShots)

console.log("Goals by zone")
console.table(totalGoals)

console.log("xG by zone")
console.table(
Object.fromEntries(
Object.entries(totalxG).map(([k,v])=>[k,v.toFixed(2)])
)
)

console.log("\nChance Types")
console.table(chanceTypes)

console.log("\nBody Parts")
console.table(bodyParts)

console.log("\nCutbacks vs Crosses")
console.table({
cutbacks,
crosses
})

console.log("\n======================================\n")

}

module.exports = { printEngineAnalytics }