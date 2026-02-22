const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  shortName: {
    type: String,
    required: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  money: {
    type: Number,
    default: 1000000
  },

  colors: {
    primary: String,
    secondary: String
  },

  teamSettings: {
    style: { type: String, default: "Ballbesitz" },
    pressing: { type: String, default: "Mittelfeldpressing" },
    tempo: { type: String, default: "Normal" }
  }

}, { timestamps: true });

module.exports = mongoose.model("Club", clubSchema);