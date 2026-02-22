require("dotenv").config();
const mongoose = require("mongoose");
const Team = require("./models/Team");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Team.deleteMany({});

  await Team.create([
    { name: "FC Thomas", points: 0, goalsFor: 0, goalsAgainst: 0, players: [] },
    { name: "FC Test", points: 0, goalsFor: 0, goalsAgainst: 0, players: [] },
    { name: "SV Manager", points: 0, goalsFor: 0, goalsAgainst: 0, players: [] },
    { name: "Dynamo Code", points: 0, goalsFor: 0, goalsAgainst: 0, players: [] }
  ]);

  console.log("✅ Teams erfolgreich erstellt");
  process.exit();
}

seed();