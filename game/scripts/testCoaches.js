require("dotenv").config()
const mongoose = require("mongoose")
const Coach = require("../models/Coach")

async function test(){

await mongoose.connect(process.env.MONGO_URI)

const count = await Coach.countDocuments()

console.log("Coaches in DB:", count)

const coach = await Coach.findOne()

console.log("Example coach:", coach.firstName, coach.lastName)

process.exit()

}

test()
