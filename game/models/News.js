const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  league: String,
  type: {
    type: String,
    enum: ["match", "transfer", "injury", "system"],
  },
  title: String,
  content: String,
  relatedMatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("News", newsSchema);