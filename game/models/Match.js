const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
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
  league: {
    type: String,
    required: true
  },
  round: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  played: {
    type: Boolean,
    default: false
  },
  homeGoals: Number,
  awayGoals: Number
});

module.exports = mongoose.model("Match", matchSchema);