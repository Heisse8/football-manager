const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({

/* =====================================
BASIC INFO
===================================== */

firstName:{
type:String,
required:true,
trim:true
},

lastName:{
type:String,
required:true,
trim:true
},

age:{
type:Number,
min:25,
max:75,
default:45
},

stars:{
type:Number,
min:1,
max:5,
required:true,
index:true
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
default:"ballbesitz",
index:true
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

personality:{
type:String,
enum:[
"balanced",
"possession_master",
"gegenpress_monster",
"defensive_wall",
"tactical_genius",
"direct_play"
],
default:"balanced",
index:true
},

/* =====================================
ATTRIBUTES
===================================== */

tactics:{
type:Number,
min:1,
max:100,
default:50
},

motivation:{
type:Number,
min:1,
max:100,
default:50
},

discipline:{
type:Number,
min:1,
max:100,
default:50
},

/* =====================================
MARKET
===================================== */

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
default:null,
index:true
},

/* =====================================
TEAM
===================================== */

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
unique:true
}

},{
timestamps:true
});

module.exports = mongoose.model("Coach", coachSchema);