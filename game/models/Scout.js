const mongoose = require("mongoose");

const scoutSchema = new mongoose.Schema({

firstName:{
type:String,
required:true
},

lastName:{
type:String,
required:true
},

stars:{
type:Number,
min:1,
max:5,
required:true
},

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

/* ================= TRANSFERMARKT ================= */

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

/* ================= TEAM ================= */

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
},

/* ================= MISSION ================= */

isOnMission:{
type:Boolean,
default:false
},

missionEnds:{
type:Date,
default:null
},

missionRegion:{
type:String,
default:null
}

},{timestamps:true});

module.exports = mongoose.model("Scout",scoutSchema);