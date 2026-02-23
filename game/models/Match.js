const mongoose = require("mongoose");

// ============================================
// 🔥 EINZELNES MATCH EVENT (90 MINUTEN TICKER)
// ============================================

const eventSchema = new mongoose.Schema({
  minute: { type: Number },
  type: { 
    type: String, 
    enum: ["goal", "yellow", "red", "injury", "substitution"] 
  },
  team: { 
    type: String, 
    enum: ["home", "away"] 
  },
  player: { type: String },
  assist: { type: String, default: null },
  text: { type: String }
}, { _id: false });


// ============================================
// 🔥 MATCH SCHEMA
// ============================================

const matchSchema = new mongoose.Schema({

  // ================= TEAMS =================
  homeTeam: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Team", 
    required: true 
  },

  awayTeam: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Team", 
    required: true 
  },

  // ================= BASIC INFO =================
  date: { 
    type: Date, 
    required: true 
  },

  matchday: { 
    type: Number, 
    required: true 
  },

  league: { 
    type: String, 
    required: true 
  },

  // ================= STATUS =================
  status: {
    type: String,
    enum: ["scheduled", "lineups_locked", "played"],
    default: "scheduled"
  },

  played: {
    type: Boolean,
    default: false
  },

  // ================= LOCKED LINEUPS =================
  lockedLineups: {
    home: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
    away: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }]
  },

  // ================= ERGEBNIS =================
  homeGoals: { type: Number, default: 0 },
  awayGoals: { type: Number, default: 0 },

  // ================= STATISTIK =================

  possession: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  },

  chances: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  },

  shots: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  },

  shotsOnTarget: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  },

  xG: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  },

  fouls: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  },

  corners: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  },

  // ================= STADION =================

  attendance: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },

  // ================= SPIELBERICHT =================

  summary: { type: String, default: "" },

  events: [eventSchema] // 🔥 90 Minuten Ticker

}, { timestamps: true });

module.exports = mongoose.model("Match", matchSchema);