const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  nationality: {
    type: String,
    required: true
  },

  // 🔥 Alter
  age: {
    type: Number,
    required: true,
    min: 16,
    max: 40
  },

  // Positionen
  positions: {
    type: [String],
    required: true
  },

  // Stärke
  stars: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },

  potential: {
    type: Number,
    min: 0,
    max: 5,
    default: 2.5
  },

  // ================= MATCH ENGINE ATTRIBUTE =================

  pace: { type: Number, min: 0, max: 99 },
  shooting: { type: Number, min: 0, max: 99 },
  passing: { type: Number, min: 0, max: 99 },
  defending: { type: Number, min: 0, max: 99 },
  physical: { type: Number, min: 0, max: 99 },
  mentality: { type: Number, min: 0, max: 99 },

  // ================= MATCH ZUSTAND =================

  fitness: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },

  morale: {
    type: Number,
    min: 0,
    max: 100,
    default: 70
  },

  // 🔥 NEUES VERLETZUNGSSYSTEM

  injuredUntil: {
    type: Date,
    default: null
  },

  suspendedUntil: {
    type: Date,
    default: null
  },

  yellowCards: {
    type: Number,
    default: 0
  },

  redCards: {
    type: Number,
    default: 0
  },

  // ================= AUFSTELLUNG =================

  startingXI: {
    type: Boolean,
    default: false
  },

  bench: {
    type: Boolean,
    default: false
  },

  lineupSlot: {
    type: String,
    default: null
  },

  // ================= TEAM =================

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Player", playerSchema);