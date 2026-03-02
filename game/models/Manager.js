const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
    unique: true
  },

  // ✅ NEU: Vorname
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  // ✅ NEU: Nachname
  lastName: {
    type: String,
    required: true,
    trim: true
  },

  age: {
    type: Number,
    required: true,
    min: 30,
    max: 75
  },

  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },

  formation: {
    type: String,
    required: true,
    enum: [
      "4-3-3",
      "4-4-2",
      "4-2-3-1",
      "3-5-2"
    ]
  },

  playstyle: {
    type: String,
    required: true,
    enum: [
      "Ballbesitz",
      "Kontern",
      "Gegenpressing",
      "Mauern"
    ]
  }

}, { timestamps: true });

module.exports = mongoose.model("Manager", managerSchema);