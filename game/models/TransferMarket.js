const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  amount: Number,
  createdAt: { type: Date, default: Date.now }
});

const transferSchema = new mongoose.Schema({
  playerId: String,
  playerName: String,

  fromTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },

  // 🔥 Pflicht Startgebot
  startPrice: { type: Number, required: true },

  // optional
  buyNowPrice: Number,

  highestBid: { type: Number, default: 0 },

  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },

  bids: [bidSchema],

  expiresAt: Date,

  status: {
    type: String,
    enum: ["open", "sold", "expired"],
    default: "open"
  }
});

module.exports = mongoose.model("TransferMarket", transferSchema);