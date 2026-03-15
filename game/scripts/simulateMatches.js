require("dotenv").config()

const mongoose = require("mongoose")
const Team = require("../models/Team")
const { simulateRealisticMatch } = require("../engines/matchEngine")
const { analyzeSimulation } = require("../utils/matchEngineAnalyzer")

async function run(){

await mongoose.connect(process.env.MONGO_URI)

const teams = await Team.find().populate("players coach")

if(!teams || teams.length < 2){

console.log("❌ Not enough teams in database")
process.exit()

}

const teamA = teams[0]
const teamB = teams[1]

let totalGoals = 0
let totalxG = 0

let homeWins = 0
let awayWins = 0
let draws = 0

// DEBUG TOTALS
let debugTotals = {
attacks:0,
buildUpFail:0,
progressionFail:0,
finalThird:0,
shots:0,
goals:0
}

const runs = 1000

// NEU → Results für Analyzer
const results = []

for(let i=0;i<runs;i++){

// Fortschritt anzeigen
if(i % 100 === 0){
console.log("simulated", i)
}

const result = await simulateRealisticMatch({
homeTeam: teamA,
awayTeam: teamB,
homePlayers: teamA.players,
awayPlayers: teamB.players,
homeCoach: teamA.coach,
awayCoach: teamB.coach,
match: null
})

if(!result) continue

// NEU → speichern für Analyzer
results.push(result)

// Goals
totalGoals += (result.result.homeGoals || 0) + (result.result.awayGoals || 0)

// xG
totalxG += (result.xG?.home || 0) + (result.xG?.away || 0)

// Win stats
if(result.result.homeGoals > result.result.awayGoals) homeWins++
else if(result.result.awayGoals > result.result.homeGoals) awayWins++
else draws++

// DEBUG SAMMELN
if(result.debug){

debugTotals.attacks += result.debug.attacks || 0
debugTotals.buildUpFail += result.debug.buildUpFail || 0
debugTotals.progressionFail += result.debug.progressionFail || 0
debugTotals.finalThird += result.debug.finalThird || 0
debugTotals.shots += result.debug.shots || 0
debugTotals.goals += result.debug.goals || 0

}

}

console.log("")
console.log("SIMULATION RESULTS")
console.log("matches:",runs)

console.log("avg goals:", (totalGoals/runs).toFixed(2))
console.log("avg xG:", (totalxG/runs).toFixed(2))

console.log("home wins:",homeWins)
console.log("away wins:",awayWins)
console.log("draws:",draws)

console.log("")
console.log("DEBUG BREAKDOWN")

console.log("attacks:", debugTotals.attacks)
console.log("buildUpFail:", debugTotals.buildUpFail)
console.log("progressionFail:", debugTotals.progressionFail)
console.log("finalThird:", debugTotals.finalThird)
console.log("shots:", debugTotals.shots)
console.log("goals:", debugTotals.goals)

console.log("")
console.log("RATES")

const buildUpSuccess = debugTotals.attacks - debugTotals.buildUpFail
const progressionSuccess = buildUpSuccess - debugTotals.progressionFail

console.log("buildUp success rate:", (buildUpSuccess / debugTotals.attacks).toFixed(2))
console.log("progression success rate:", (progressionSuccess / buildUpSuccess).toFixed(2))
console.log("shot conversion:", (debugTotals.goals / Math.max(1,debugTotals.shots)).toFixed(2))

// ANALYZER AUSFÜHREN
console.log("")
console.log("ENGINE ANALYSIS")
console.log("--------------------------")

analyzeSimulation(results)

process.exit()

}

run()
