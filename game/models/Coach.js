const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({

firstName:{
type:String,
required:true
},

lastName:{
type:String,
required:true
},

age:{
type:Number,
default:45
},

stars:{
type:Number,
min:1,
max:5,
required:true
},

/* =====================================
TRAINER STYLE
===================================== */

philosophy:{
type:String,
enum:[
"ballbesitz",
"gegenpressing",
"konter",
"defensiv"
],
default:"ballbesitz"
},

preferredFormation:{
type:String,
enum:[
"4-4-2",
"4-3-3",
"4-2-3-1",
"3-5-2",
"5-3-2"
],
default:"4-4-2"
},

/* =====================================
MARKET
===================================== */

isListed:{
type:Boolean,
default:true
},

transferPrice:{
type:Number,
required:true
},

sellerTeam:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
},

/* =====================================
TEAM
===================================== */

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
}

},{timestamps:true});

module.exports = mongoose.model("Coach", coachSchema);