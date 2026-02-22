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
  competition: {
    type: String, // LEAGUE oder CUP
    required: true
  },
  league: String,
  country: String,
  matchday: Number,
  round: Number,
  date: Date,
  played: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports =
  mongoose.models.Match || mongoose.model("Match", matchSchema);