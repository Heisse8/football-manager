const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },

  homeGoals: Number,
  awayGoals: Number,

  possession: {
    home: Number,
    away: Number
  },

  xG: {
    home: Number,
    away: Number
  },

  stats: {
    shots: {
      home: Number,
      away: Number
    },
    corners: {
      home: Number,
      away: Number
    },
    freeKicks: {
      home: Number,
      away: Number
    },
    penalties: {
      home: Number,
      away: Number
    },
    cards: {
      home: {
        yellows: Number,
        reds: Number
      },
      away: {
        yellows: Number,
        reds: Number
      }
    }
  },

  summary: String,
  attendance: Number,

  status: {
    type: String,
    default: "scheduled"
  },

  played: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Match", matchSchema);