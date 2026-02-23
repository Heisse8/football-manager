const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  shortName: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  league: { type: String, required: true },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true // Jeder User nur 1 Team
  }
});

module.exports = mongoose.model("Team", teamSchema);