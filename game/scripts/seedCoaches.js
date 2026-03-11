const mongoose = require("mongoose");
require("dotenv").config();

const Coach = require("../models/Coach");
const Team = require("../models/Team");

async function seedCoaches(){

await mongoose.connect(process.env.MONGO_URI);

const teams = await Team.find();

for(const team of teams){

let coachData = {
name:"Generic Coach",
playStyle:"ballbesitz",
favoriteFormation:"433",
stars:3
};

/* ======================================================
 TEAM SPEZIFISCHE TRAINER
====================================================== */

switch(team.name){

case "Bayern München":

coachData = {
name:"Vincent Kompany",
playStyle:"gegenpressing",
favoriteFormation:"433",
stars:5
};

break;

case "Bayer Leverkusen":

coachData = {
name:"Xabi Alonso",
playStyle:"ballbesitz",
favoriteFormation:"3421",
stars:5
};

break;

case "Borussia Dortmund":

coachData = {
name:"Edin Terzic",
playStyle:"gegenpressing",
favoriteFormation:"4231",
stars:4.5
};

break;

case "RB Leipzig":

coachData = {
name:"Marco Rose",
playStyle:"gegenpressing",
favoriteFormation:"4222",
stars:4.5
};

break;

case "Union Berlin":

coachData = {
name:"Union Coach",
playStyle:"defensiv",
favoriteFormation:"352",
stars:3.5
};

break;

}

/* ======================================================
 COACH SPEICHERN
====================================================== */

await Coach.create({

...coachData,
team:team._id

});

console.log("Coach created for:",team.name);

}

console.log("All coaches created");

process.exit();

}

seedCoaches();