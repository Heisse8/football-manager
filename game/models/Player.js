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

  // Mehrfachpositionen (z.B. ["CM","CDM"])
  positions: {
    type: [String],
    required: true
  },

  // ⭐ 0 – 5 in 0.5 Schritten
  stars: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },

  // ================= MATCH ENGINE ATTRIBUTE =================

  pace: { type: Number, min: 0, max: 99 },
  shooting: { type: Number, min: 0, max: 99 },
  passing: { type: Number, min: 0, max: 99 },
  defending: { type: Number, min: 0, max: 99 },
  physical: { type: Number, min: 0, max: 99 },
  mentality: { type: Number, min: 0, max: 99 },

  // ================= AUFSTELLUNG =================

  startingXI: {
    type: Boolean,
    default: false
  },

  bench: {
    type: Boolean,
    default: false
  },

  // Optional: Slot in Formation (z.B. "ST1", "CB2")
  lineupSlot: {
    type: String,
    default: null
  },

  // ================= ZUGEHÖRIGES TEAM =================

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Player", playerSchema);