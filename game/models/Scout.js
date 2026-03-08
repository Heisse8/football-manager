const mongoose = require("mongoose");

const scoutSchema = new mongoose.Schema({

/* =====================================================
BASIS
===================================================== */

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
default:40
},

stars:{
type:Number,
min:1,
max:5,
required:true
},

/* =====================================================
SCOUT QUALITÄT
===================================================== */

scoutingSkill:{
type:Number,
default:50
},

potentialDetection:{
type:Number,
default:50
},

network:{
type:Number,
default:50
},

/* =====================================================
REGION SPEZIALISIERUNG
===================================================== */

regionSpecialty:{
type:String,
enum:[
"europa",
"suedamerika",
"afrika",
"asien",
"nordamerika",
"australien"
],
default:null
},

/* =====================================================
TRANSFERMARKT
===================================================== */

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

/* =====================================================
TEAM ZUGEHÖRIGKEIT
===================================================== */

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
},

/* =====================================================
MISSION SYSTEM
===================================================== */

isOnMission:{
type:Boolean,
default:false
},

missionRegion:{
type:String,
enum:[
"europa",
"suedamerika",
"afrika",
"asien",
"nordamerika",
"australien"
],
default:null
},

missionDuration:{
type:Number,
default:null
},

missionStarted:{
type:Date,
default:null
},

missionEnds:{
type:Date,
default:null
},

/* =====================================================
SCOUT LEVEL SYSTEM
===================================================== */

experience:{
type:Number,
default:0
},

level:{
type:Number,
default:1
}

},{timestamps:true});

module.exports = mongoose.model("Scout", scoutSchema);