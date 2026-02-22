const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: String,
  position: String, // GK, CB, ST etc.
  rating: Number,
  fitness: { type: Number, default: 1 },
  injured: { type: Boolean, default: false },
  isStarting: { type: Boolean, default: false },
  seasonGoals: { type: Number, default: 0 },
  seasonAssists: { type: Number, default: 0 },
  age: { type: Number, default: 24 }
});

const teamSchema = new mongoose.Schema({
  name: String,

  players: [playerSchema],

  formation: { type: String, default: "4-4-2" },

  // Tabelle
  points: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  losses: { type: Number, default: 0 }
});

module.exports = mongoose.model("Team", teamSchema);