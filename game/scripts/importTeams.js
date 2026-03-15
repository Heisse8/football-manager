require("dotenv").config()

const mongoose = require("mongoose")
const Team = require("../models/Team")
const teams = require("../data/teams")

async function run(){

await mongoose.connect(process.env.MONGO_URI)

await Team.deleteMany({})

await Team.insertMany(teams)

console.log("Teams importiert:", teams.length)

process.exit()

}

run()
