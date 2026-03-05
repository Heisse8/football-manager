const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema({

seasonNumber: {
type: Number,
required: true
},

currentMatchday: {
type: Number,
default: 0
},

totalMatchdays: {
type: Number,
default: 34
},

seasonStart: {
type: Date,
required: true
},

seasonEnd: {
type: Date,
required: true
},

transferWindowOpen: {
type: Boolean,
default: true
},

winterTransferOpen: {
type: Boolean,
default: false
},

status: {
type: String,
enum: ["preseason","running","finished"],
default: "preseason"
}

}, { timestamps:true });

module.exports = mongoose.model("Season", seasonSchema);