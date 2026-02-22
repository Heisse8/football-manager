const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: String,
  shortName: String,
  logo: String,
  players: Array
});

module.exports = mongoose.model("Team", teamSchema);