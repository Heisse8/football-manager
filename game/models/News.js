const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({

title: {
type: String,
required: true
},

content: {
type: String,
required: true
},

type: {
type: String,
enum: ["match","transfer","team","league"],
default: "league"
},

team: {
type: mongoose.Schema.Types.ObjectId,
ref: "Team",
default: null
},

player: {
type: mongoose.Schema.Types.ObjectId,
ref: "Player",
default: null
},

league: {
type: String,
default: null
},

}, { timestamps:true });

module.exports = mongoose.model("News", newsSchema);