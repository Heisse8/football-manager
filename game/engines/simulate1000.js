const { simulateRealisticMatch } = require("./matchEngine")
const { printEngineAnalytics } = require("./engineAnalytics");
const { generateShotHeatmap } = require("../utils/shotHeatmap")

/* ======================================================
 BASIS SPIELER
====================================================== */

const basePlayers = [

{ _id:1, firstName:"GK", lastName:"Home", positions:["GK"], defending:75, mentality:65 },

{ _id:2, firstName:"CB1", lastName:"Home", positions:["CB"], defending:70, physical:70 },
{ _id:3, firstName:"CB2", lastName:"Home", positions:["CB"], defending:70, physical:70 },
{ _id:4, firstName:"LB", lastName:"Home", positions:["LB"], defending:65, pace:65 },
{ _id:5, firstName:"RB", lastName:"Home", positions:["RB"], defending:65, pace:65 },

{ _id:6, firstName:"CM1", lastName:"Home", positions:["CM"], passing:70, mentality:65 },
{ _id:7, firstName:"CM2", lastName:"Home", positions:["CM"], passing:70, mentality:65 },
{ _id:8, firstName:"CAM", lastName:"Home", positions:["CAM"], passing:75, shooting:65 },

{ _id:9, firstName:"LW", lastName:"Home", positions:["LW"], pace:75, dribbling:70 },
{ _id:10, firstName:"RW", lastName:"Home", positions:["RW"], pace:75, dribbling:70 },
{ _id:11, firstName:"ST", lastName:"Home", positions:["ST"], shooting:75, mentality:70 }

]

/* ======================================================
 TEAMS
====================================================== */

const homeTeam = {
attackStrength:65,
defenseStrength:60,
possessionSkill:62,
tacticalStyle:"possession",
stadiumCapacity:40000,
attendance:35000
}

const awayTeam = {
attackStrength:60,
defenseStrength:58,
possessionSkill:55,
tacticalStyle:"possession"
}

/* ======================================================
 MATCH SIMULATION
====================================================== */

async function run(){

const matches = 50000

let homeGoals = 0
let awayGoals = 0

let shotsHome = 0
let shotsAway = 0

let xGHome = 0
let xGAway = 0

let possessionHome = 0
let possessionAway = 0

let redHome = 0
let redAway = 0

/* ENGINE FLOW DEBUG */

let debug = {
attacks:0,
buildUpFail:0,
progressionFail:0,
finalThird:0,
shots:0,
goals:0
}

/* RESULTS FÜR ANALYTICS */

const results = []

console.time("simulation")

for(let i=0;i<matches;i++){

const homePlayers = basePlayers.map(p => ({ ...p }))
const awayPlayers = basePlayers.map(p => ({ ...p }))

const result = await simulateRealisticMatch({

homeTeam:{ ...homeTeam },
awayTeam:{ ...awayTeam },

homePlayers,
awayPlayers,

homeCoach:{},
awayCoach:{},

match:{ type:"league" }

})

results.push(result)

/* GOALS */

homeGoals += result.result.homeGoals
awayGoals += result.result.awayGoals

/* SHOTS */

shotsHome += result.stats.shots.home
shotsAway += result.stats.shots.away

/* XG */

xGHome += result.xG.home
xGAway += result.xG.away

/* POSSESSION */

possessionHome += result.possession.home
possessionAway += result.possession.away

/* CARDS */

redHome += result.stats.cards.home.red
redAway += result.stats.cards.away.red

/* DEBUG FLOW */

if(result.debug){

debug.attacks += result.debug.attacks || 0
debug.buildUpFail += result.debug.buildUpFail || 0
debug.progressionFail += result.debug.progressionFail || 0
debug.finalThird += result.debug.finalThird || 0
debug.shots += result.debug.shots || 0
debug.goals += result.debug.goals || 0

}

}

console.timeEnd("simulation")

console.log("Matches:",matches)

/* GOALS */

console.log("\nAverage goals:")
console.log("Home:", (homeGoals/matches).toFixed(2))
console.log("Away:", (awayGoals/matches).toFixed(2))
console.log("Total:", ((homeGoals+awayGoals)/matches).toFixed(2))

/* SHOTS */

console.log("\nAverage shots:")
console.log("Home:", (shotsHome/matches).toFixed(2))
console.log("Away:", (shotsAway/matches).toFixed(2))
console.log("Total:", ((shotsHome+shotsAway)/matches).toFixed(2))

/* XG */

console.log("\nAverage xG:")
console.log("Home:", (xGHome/matches).toFixed(2))
console.log("Away:", (xGAway/matches).toFixed(2))
console.log("Total:", ((xGHome+xGAway)/matches).toFixed(2))

/* POSSESSION */

console.log("\nAverage possession:")
console.log("Home:", (possessionHome/matches).toFixed(1), "%")
console.log("Away:", (possessionAway/matches).toFixed(1), "%")

/* RED CARDS */

console.log("\nRed cards per match:")
console.log("Home:", (redHome/matches).toFixed(3))
console.log("Away:", (redAway/matches).toFixed(3))

/* ENGINE FLOW */

console.log("\nENGINE FLOW DEBUG")

console.log("Attacks per match:", (debug.attacks/matches).toFixed(2))
console.log("BuildUp fails:", (debug.buildUpFail/matches).toFixed(2))
console.log("Progression fails:", (debug.progressionFail/matches).toFixed(2))
console.log("Final third entries:", (debug.finalThird/matches).toFixed(2))
console.log("Shots:", (debug.shots/matches).toFixed(2))
console.log("Goals:", (debug.goals/matches).toFixed(2))

/* ENGINE ANALYTICS */

printEngineAnalytics(results)
generateShotHeatmap(results)
}

run()