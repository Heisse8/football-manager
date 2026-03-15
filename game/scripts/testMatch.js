require("dotenv").config()

const mongoose = require("mongoose")

const Team = require("../models/Team")
const { simulateRealisticMatch } = require("../engines/matchEngine")

async function run(){

await mongoose.connect(process.env.MONGO_URI)

const teams = await Team
.find()
.populate("players")
.populate("coach")

if(teams.length < 2){
console.log("Nicht genug Teams")
process.exit()
}

const teamA = teams[0]
const teamB = teams[1]

const result = await simulateRealisticMatch({

homeTeam: teamA,
awayTeam: teamB,

homePlayers: teamA.players,
awayPlayers: teamB.players,

homeCoach: teamA.coach,
awayCoach: teamB.coach,

match: null

})

console.log("MATCH RESULT")
console.log(teamA.name, result.result.homeGoals, "-", result.result.awayGoals, teamB.name)

console.log("xG")
console.log(result.xG)

process.exit()

}

run()
