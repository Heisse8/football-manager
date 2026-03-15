require("dotenv").config()


const mongoose = require("mongoose")
const Coach = require("../models/Coach")
const coaches = require("../data/coaches")

const { generateCoachName } = require("../utils/coachNameMutator")
const { calculateCoachPrice } = require("../utils/coachPriceCalculator")
const { generateCoachDNA } = require("../utils/generateCoachDNA")


async function seed(){

await mongoose.connect(process.env.MONGO_URI)

for(const c of coaches){

/* Prüfen ob Trainer schon existiert */

let coach = await Coach.findOne({
originalFirstName: c.firstName,
originalLastName: c.lastName
})

if(!coach){

/* Name nur einmal generieren */

const name = generateCoachName(c.firstName, c.lastName)

coach = await Coach.create({

originalFirstName: c.firstName,
originalLastName: c.lastName,

firstName: name.firstName,
lastName: name.lastName,

stars: c.stars,

philosophy: c.style,
preferredFormation: c.preferredFormation,
personality: c.personality,

tactics: c.tactics,
motivation: c.motivation,
discipline: c.discipline,

coachDNA: generateCoachDNA(c),



transferPrice: calculateCoachPrice(c),

isListed: true

})

}

}

console.log("Coaches seeded")

process.exit()

}

seed()
