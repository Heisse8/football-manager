const mongoose = require("mongoose");

const scoutSchema = new mongoose.Schema({

/* =====================================================
BASIS
===================================================== */

firstName:{
type:String,
required:true,
trim:true,
maxlength:30
},

lastName:{
type:String,
required:true,
trim:true,
maxlength:30
},

age:{
type:Number,
default:40,
min:25,
max:75
},

stars:{
type:Number,
min:1,
max:5,
required:true,
index:true
},

/* =====================================================
SCOUT QUALITÄT
===================================================== */

scoutingSkill:{
type:Number,
min:1,
max:100,
default:50
},

potentialDetection:{
type:Number,
min:1,
max:100,
default:50
},

network:{
type:Number,
min:1,
max:100,
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
default:null,
index:true
},

/* =====================================================
TRANSFERMARKT
===================================================== */

isListed:{
type:Boolean,
default:true,
index:true
},

transferPrice:{
type:Number,
required:true,
min:0
},

sellerTeam:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
},

/* =====================================================
TEAM
===================================================== */

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null,
index:true
},

/* =====================================================
MISSION SYSTEM
===================================================== */

isOnMission:{
type:Boolean,
default:false,
index:true
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
default:null,
index:true
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

},{
timestamps:true
});

/* =====================================================
INDEXES
===================================================== */

scoutSchema.index({ team:1 });
scoutSchema.index({ isListed:1 });
scoutSchema.index({ regionSpecialty:1 });

module.exports = mongoose.model("Scout", scoutSchema);