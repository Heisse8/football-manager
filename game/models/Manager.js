const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({

/* =====================================
TEAM
===================================== */

team: {
type: mongoose.Schema.Types.ObjectId,
ref: "Team",
required: true,
unique: true,
index: true
},

/* =====================================
NAME
===================================== */

firstName: {
type: String,
required: true,
trim: true,
maxlength: 30
},

lastName: {
type: String,
required: true,
trim: true,
maxlength: 30
},

age: {
type: Number,
required: true,
min: 30,
max: 75
},

/* =====================================
TRAINER RATING
===================================== */

rating: {
type: Number,
required: true,
min: 0,
max: 5,
index: true
},

/* =====================================
TAKTIK
===================================== */

formation: {
type: String,
required: true,
enum: [
"4-3-3",
"4-4-2",
"4-2-3-1",
"3-5-2"
],
index: true
},

playstyle: {
type: String,
required: true,
enum: [
"Ballbesitz",
"Kontern",
"Gegenpressing",
"Mauern"
],
index: true
},

/* =====================================
ZUKÜNFTIGE FEATURES
===================================== */

experience: {
type: Number,
default: 0
},

reputation: {
type: Number,
min: 1,
max: 100,
default: 50
}

},{
timestamps: true
});

module.exports = mongoose.model("Manager", managerSchema);