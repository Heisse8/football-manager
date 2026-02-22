const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,           // 🔥 Kein Teamname doppelt
    trim: true
  },

  shortName: {
    type: String,
    required: true,
    unique: true,           // 🔥 Kein Kürzel doppelt
    trim: true
  },

  league: {
    type: String,
    required: true
  },

  country: {
    type: String,
    required: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true            // 🔥 Ein User nur ein Team
  },

  players: {
    type: Array,
    default: []
  },

  formation: {
    type: String,
    default: "4-4-2"
  },

  points: {
    type: Number,
    default: 0
  },

  gamesPlayed: {
    type: Number,
    default: 0
  },

  wins: {
    type: Number,
    default: 0
  },

  draws: {
    type: Number,
    default: 0
  },

  losses: {
    type: Number,
    default: 0
  },

  goalsFor: {
    type: Number,
    default: 0
  },

  goalsAgainst: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

/*
  🔥 WICHTIG:
  Verhindert OverwriteModelError auf Render / Deploy
*/
module.exports =
  mongoose.models.Team || mongoose.model("Team", teamSchema);