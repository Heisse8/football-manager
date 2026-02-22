const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  home: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  away: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  homeGoals: Number,
  awayGoals: Number,
  played: { type: Boolean, default: false }
});

const leagueSchema = new mongoose.Schema({
  currentMatchday: { type: Number, default: 1 },
  schedule: [[matchSchema]]
});

module.exports = mongoose.model("League", leagueSchema);