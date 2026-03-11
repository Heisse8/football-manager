const Coach = require("../models/Coach");
const coaches = require("../data/coachPool");

async function seedCoaches(){

await Coach.deleteMany({ team:null });

await Coach.insertMany(
coaches.map(c => ({
...c,
team:null,
isListed:true,
sellerTeam:null
}))
);

console.log("Trainer Pool erstellt:", coaches.length);

}

module.exports = { seedCoaches };