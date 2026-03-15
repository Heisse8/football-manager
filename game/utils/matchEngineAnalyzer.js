function analyzeSimulation(results){

let matches = results.length

let goals = 0
let xG = 0
let shots = 0
let attacks = 0

for(const r of results){

goals += r.result.homeGoals + r.result.awayGoals
xG += r.xG.home + r.xG.away

shots += r.stats.shots.home + r.stats.shots.away

attacks += r.debug.attacks

}

const goalsPerMatch = goals / matches
const xGPerMatch = xG / matches
const shotsPerMatch = shots / matches
const attacksPerMatch = attacks / matches

const xGPerShot = xG / shots
const goalsPerShot = goals / shots
const goalsPerXG = goals / xG

console.log("\nENGINE ANALYSIS")
console.log("---------------------------")

console.log("matches:", matches)

console.log("\nMATCH OUTPUT")
console.log("goals per match:", goalsPerMatch.toFixed(2))
console.log("xG per match:", xGPerMatch.toFixed(2))
console.log("shots per match:", shotsPerMatch.toFixed(2))
console.log("attacks per match:", attacksPerMatch.toFixed(2))

console.log("\nEFFICIENCY")
console.log("xG per shot:", xGPerShot.toFixed(3))
console.log("goals per shot:", goalsPerShot.toFixed(3))
console.log("goals per xG:", goalsPerXG.toFixed(3))

console.log("\nREALISM CHECK")

checkRange("goals per match", goalsPerMatch, 2.2, 2.8)
checkRange("shots per match", shotsPerMatch, 18, 26)
checkRange("attacks per match", attacksPerMatch, 90, 120)
checkRange("xG per shot", xGPerShot, 0.08, 0.13)
checkRange("goals per xG", goalsPerXG, 0.9, 1.1)

}

function checkRange(label,value,min,max){

if(value < min){
console.log("❌",label,"too LOW:",value.toFixed(2))
return
}

if(value > max){
console.log("❌",label,"too HIGH:",value.toFixed(2))
return
}

console.log("✅",label,"OK")

}

module.exports = { analyzeSimulation }
