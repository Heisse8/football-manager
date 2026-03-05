const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({

/* ================= BASIS ================= */

firstName: {
type: String,
required: true
},

lastName: {
type: String,
required: true
},

nationality: {
type: String,
required: true
},

age: {
type: Number,
required: true,
min: 16,
max: 40
},

/* ================= POSITIONEN ================= */

positions: {
type: [String],
required: true
},

/* ================= PLAYSTYLE ================= */

playStyle: {
type: String,
enum: [
"finisher",
"targetman",
"poacher",
"playmaker",
"winger",
"box_to_box",
"ball_winner",
"deep_playmaker",
"sweeper_keeper",
"defensive_wall"
],
default: null
},

/* ================= RATING ================= */

stars: {
type: Number,
required: true,
min: 0.5,
max: 5
},

potential: {
type: Number,
min: 0.5,
max: 5,
default: 2.5
},

/* ================= MARKTWERT ================= */

marketValue: {
type: Number,
default: 0
},

/* ================= MATCH ENGINE ATTRIBUTE ================= */

pace: { type: Number, min: 0, max: 99 },
shooting: { type: Number, min: 0, max: 99 },
passing: { type: Number, min: 0, max: 99 },
defending: { type: Number, min: 0, max: 99 },
physical: { type: Number, min: 0, max: 99 },
mentality: { type: Number, min: 0, max: 99 },

/* ================= MATCH ZUSTAND ================= */

fitness: {
type: Number,
min: 0,
max: 100,
default: 100
},

morale: {
type: Number,
min: 0,
max: 100,
default: 70
},

/* ================= VERLETZUNG / SPERREN ================= */

injuredUntil: {
type: Date,
default: null
},

suspendedUntil: {
type: Date,
default: null
},

yellowCards: {
type: Number,
default: 0
},

redCards: {
type: Number,
default: 0
},

/* ================= MATCH STATISTIK ================= */

seasonStats: {

games: {
type: Number,
default: 0
},

goals: {
type: Number,
default: 0
},

assists: {
type: Number,
default: 0
},

rating: {
type: Number,
default: 6.5
},

cleanSheets: {
type: Number,
default: 0
},

saves: {
type: Number,
default: 0
}

},

/* ================= KARRIERE STATISTIK ================= */

careerStats: {

games: {
type: Number,
default: 0
},

goals: {
type: Number,
default: 0
},

assists: {
type: Number,
default: 0
},

cleanSheets: {
type: Number,
default: 0
},

saves: {
type: Number,
default: 0
}

},

/* ================= AUFSTELLUNG ================= */

startingXI: {
type: Boolean,
default: false
},

bench: {
type: Boolean,
default: false
},

lineupSlot: {
type: String,
default: null
},

/* ================= TEAM ================= */

team: {
type: mongoose.Schema.Types.ObjectId,
ref: "Team",
default: null
}

}, { timestamps: true });

module.exports = mongoose.model("Player", playerSchema);

