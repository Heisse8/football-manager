const mongoose = require("mongoose");

const stadiumSchema = new mongoose.Schema({

  // ================= TEAM =================
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
    unique: true
  },

  // ================= STADIONNAME =================
  name: {
    type: String,
    default: null,
    maxlength: 30
  },

  nameLocked: {
    type: Boolean,
    default: false
  },

  // ================= BASISDATEN =================
  capacity: {
    type: Number,
    default: 2000,
    min: 2000
  },

  ticketPrice: {
    type: Number,
    default: 15,
    min: 5,
    max: 100
  },

  // ================= LETZTES HEIMSPIEL =================
  lastAttendance: {
    type: Number,
    default: 0
  },

  lastRevenue: {
    type: Number,
    default: 0
  },

  // ================= BAU (ECHTZEIT) =================
  construction: {
    inProgress: {
      type: Boolean,
      default: false
    },
    targetCapacity: {
      type: Number,
      default: null
    },
    startDate: {
      type: Date,
      default: null
    },
    finishDate: {
      type: Date,
      default: null
    }
  }

}, { timestamps: true });

module.exports = mongoose.model("Stadium", stadiumSchema);