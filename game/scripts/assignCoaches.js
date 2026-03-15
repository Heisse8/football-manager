require("dotenv").config()

const mongoose = require("mongoose")
const Coach = require("../models/Coach")
const Team = require("../models/Team")

async function run(){

await mongoose.connect(process.env.MONGO_URI)

const teams = await Team.find()
const coaches = await Coach.find()

for(let i = 0; i < teams.length; i++){

const team = teams[i]
const coach = coaches[i]

if(!coach) continue

/* ======================================================
COACH DNA FIX (0 - 1 RANGE)
====================================================== */

coach.coachDNA = coach.coachDNA || {}

coach.coachDNA.tempo = clamp(coach.coachDNA.tempo ?? 0.5)
coach.coachDNA.pressing = clamp(coach.coachDNA.pressing ?? 0.5)
coach.coachDNA.width = clamp(coach.coachDNA.width ?? 0.5)
coach.coachDNA.directness = clamp(coach.coachDNA.directness ?? 0.5)
coach.coachDNA.risk = clamp(coach.coachDNA.risk ?? 0.5)
coach.coachDNA.defensiveLine = clamp(coach.coachDNA.defensiveLine ?? 0.5)

/* ======================================================
ASSIGN TEAM
====================================================== */

team.coach = coach._id
coach.team = team._id

await team.save()
await coach.save()

}

console.log("Trainer zugewiesen:", teams.length)

process.exit()

}

run()

/* ======================================================
UTILITY
====================================================== */

function clamp(value){

if(value < 0) return 0
if(value > 1) return 1

return value

}
