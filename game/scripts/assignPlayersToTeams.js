require("dotenv").config()

const mongoose = require("mongoose")
const Player = require("../models/Player")
const Team = require("../models/Team")

async function run(){

await mongoose.connect(process.env.MONGO_URI)

const players = await Player.find()
const teams = await Team.find()

if(!teams.length){
console.log("❌ No teams found")
process.exit()
}

let teamIndex = 0

for(const player of players){

const team = teams[teamIndex]

player.team = team._id
await player.save()

team.players.push(player._id)

teamIndex++

if(teamIndex >= teams.length){
teamIndex = 0
}

}

for(const team of teams){
await team.save()
}

console.log("✅ Players assigned to teams")

process.exit()

}

run()
