const mongoose = require("mongoose");

const lineupSlotSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  position: { type: String }, // z.B. "LCB", "RCM", "LW"
  role: { type: String } // z.B. "box_to_box", "inverser_fluegel"
}, { _id: false });

const teamSchema = new mongoose.Schema({

  // ================= BASIS =================

  name: { type: String, required: true, unique: true },
  shortName: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  league: { type: String, required: true },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  // ================= TAKTIK =================

  tactics: {

    // Grundidee
    playStyle: {
      type: String,
      enum: ["ballbesitz", "konter", "gegenpressing", "mauern"],
      default: "ballbesitz"
    },

    // Pressinghöhe
    pressing: {
      type: String,
      enum: ["sehr_hoch", "hoch", "mittel", "low_block"],
      default: "mittel"
    },

    // Abwehrlinie
    defensiveLine: {
      type: String,
      enum: ["hoch", "mittel", "tief"],
      default: "mittel"
    },

    // Passspiel
    passingStyle: {
      type: String,
      enum: ["kurz", "variabel", "lang"],
      default: "variabel"
    },

    // Tempo
    tempo: {
      type: String,
      enum: ["langsam", "kontrolliert", "hoch", "sehr_hoch"],
      default: "kontrolliert"
    },

    // Breite im Ballbesitz
    width: {
      type: String,
      enum: ["sehr_eng", "eng", "normal", "breit"],
      default: "normal"
    },

    // Umschalten nach Ballgewinn
    transitionAfterWin: {
      type: String,
      enum: ["vertikal", "kontrolliert", "fluegel"],
      default: "kontrolliert"
    },

    // Verhalten nach Ballverlust
    transitionAfterLoss: {
      type: String,
      enum: ["gegenpressing", "mittelfeldpressing", "rueckzug"],
      default: "mittelfeldpressing"
    },

    // Globale Mentalität
    mentality: {
      type: String,
      enum: ["defensiv", "ausgewogen", "offensiv", "sehr_offensiv"],
      default: "ausgewogen"
    }
  },

  // ================= AUFSTELLUNG =================

  lineup: [lineupSlotSchema],

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

  balance: { type: Number, default: 1000000 }

}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);