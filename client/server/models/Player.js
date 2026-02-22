const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club"
  },
  name: String,
  age: Number,
  position: String,
  positions: [String], // <-- HINZUFÜGEN
  overall: Number,
  stamina: Number
});

module.exports = mongoose.model("Player", playerSchema);