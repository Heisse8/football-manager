require("dotenv").config()

const mongoose = require("mongoose")
const Player = require("../models/Player")

const players = require("../data/players.json")

const { calculateStars } =
require("../utils/playerRating")

async function run(){

await mongoose.connect(process.env.MONGO_URI)

for(const p of players){

p.stars = calculateStars(p)

await Player.create(p)

console.log("imported", p.firstName, p.lastName)

}

console.log("DONE")

process.exit()

}

run()
