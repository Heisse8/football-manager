const mongoose = require("mongoose");

const stadiumSchema = new mongoose.Schema({

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },

  name: {
    type: String,
    default: null
  },

  capacity: {
    type: Number,
    default: 2000
  },

  ticketPrice: {
    type: Number,
    default: 15
  },

  construction: {
    inProgress: { type: Boolean, default: false },
    targetCapacity: { type: Number, default: null },
    startMatchday: { type: Number, default: null },
    finishMatchday: { type: Number, default: null }
  }

}, { timestamps: true });

module.exports = mongoose.model("Stadium", stadiumSchema);