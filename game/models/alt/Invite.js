const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  league: { type: mongoose.Schema.Types.ObjectId, ref: "League" },
  used: { type: Boolean, default: false }
});

module.exports = mongoose.model("Invite", inviteSchema);