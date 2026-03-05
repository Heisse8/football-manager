const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({

/* ================= BASIS ================= */

firstName:{
type:String,
required:true
},

lastName:{
type:String,
required:true
},

nationality:{
type:String,
required:true
},

age:{
type:Number,
min:30,
max:75,
required:true
},

/* ================= QUALITÄT ================= */

stars:{
type:Number,
min:1,
max:5,
required:true
},

/* ================= TRAINER PHILOSOPHIE ================= */

philosophy:{
type:String,
enum:["ballbesitz","gegenpressing","konter","defensiv"],
default:"ballbesitz"
},

preferredFormation:{
type:String,
enum:[
"442",
"4231",
"433",
"41212",
"4141",
"352",
"343",
"3421",
"532",
"541",
"5212"
],
default:"433"
},

/* ================= TAKTIK ================= */

tempo:{
type:String,
enum:["langsam","kontrolliert","hoch"],
default:"kontrolliert"
},

pressing:{
type:String,
enum:["hoch","mittel","tief"],
default:"mittel"
},

/* ================= TEAM ================= */

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
}

},{timestamps:true});

module.exports = mongoose.model("Coach", coachSchema);