const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema({
  league: {
    type: String,
    required: true
  },
  seasonStart: {
    type: Date,
    required: true
  },
  isGenerated: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Season", seasonSchema);