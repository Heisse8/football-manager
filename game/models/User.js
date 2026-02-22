const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  league: { type: mongoose.Schema.Types.ObjectId, ref: "League" }
});

module.exports = mongoose.model("User", userSchema);