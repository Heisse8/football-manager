const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({

  // ================= BASIS =================

  name: {
    type: String,
    required: true,
    unique: true
  },

  shortName: {
    type: String,
    required: true,
    unique: true
  },

  country: {
    type: String,
    required: true
  },

  league: {
    type: String,
    required: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  // ================= TAKTIK =================

  tactics: {

    playStyle: {
      type: String,
      enum: ["ballbesitz", "konter", "gegenpressing", "mauern"],
      default: "ballbesitz"
    },

    pressing: {
      type: String,
      enum: ["sehr_hoch", "hoch", "mittel", "low_block"],
      default: "mittel"
    },

    defensiveLine: {
      type: String,
      enum: ["hoch", "mittel", "tief"],
      default: "mittel"
    },

    passingStyle: {
      type: String,
      enum: ["kurz", "variabel", "lang"],
      default: "variabel"
    },

    tempo: {
      type: String,
      enum: ["langsam", "kontrolliert", "hoch", "sehr_hoch"],
      default: "kontrolliert"
    },

    width: {
      type: String,
      enum: ["sehr_eng", "eng", "normal", "breit"],
      default: "normal"
    },

    transitionAfterWin: {
      type: String,
      enum: ["vertikal", "kontrolliert", "fluegel"],
      default: "kontrolliert"
    },

    transitionAfterLoss: {
      type: String,
      enum: ["gegenpressing", "mittelfeldpressing", "rueckzug"],
      default: "mittelfeldpressing"
    },

    mentality: {
      type: String,
      enum: ["defensiv", "ausgewogen", "offensiv", "sehr_offensiv"],
      default: "ausgewogen"
    }
  },

  // ================= AUFSTELLUNG =================

  /*
    Aktuelles bearbeitbares Lineup
    Beispiel:
    {
      GK: ObjectId,
      LCB: ObjectId,
      ST1: ObjectId
    }
  */
  lineup: {
    type: Object,
    default: {}
  },

  /*
    Ersatzbank
  */
  bench: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Player",
    default: []
  },

  /*
    Aktive Formation
  */
  formation: {
    type: String,
    default: "4-4-2"
  },

  // ================= 🔒 LINEUP LOCK SYSTEM =================

  /*
    Wird am Spieltag 22:00 aktiviert
  */
  lineupLocked: {
    type: Boolean,
    default: false
  },

  /*
    Eingefrorene Startelf für MatchEngine
  */
  lockedLineup: {
    type: Object,
    default: {}
  },

  /*
    Eingefrorene Ersatzbank
  */
  lockedBench: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Player",
    default: []
  },

  // ================= TABELLENWERTE =================

  points: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },

  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  goalDifference: { type: Number, default: 0 },

  tablePosition: { type: Number, default: 0 },

  // ================= FINANZEN =================

  balance: {
    type: Number,
    default: 1000000
  }

}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);