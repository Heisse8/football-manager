const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({

  competition: {
    type: String,
    default: "league"
  },

  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },

  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },

  homeGoals: { type: Number, default: 0 },
  awayGoals: { type: Number, default: 0 },

  xG: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  },

  possession: {
    home: { type: Number, default: 50 },
    away: { type: Number, default: 50 }
  },

  stats: { type: Object },

  events: { type: Array, default: [] },
  ticker: { type: Array, default: [] },

  summary: { type: String },

  attendance: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["scheduled", "lineups_locked", "played"],
    default: "scheduled"
  },

  played: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Match", matchSchema);