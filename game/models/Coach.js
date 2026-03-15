const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({

/* =====================================
BASIC INFO
===================================== */

originalFirstName:{
type:String,
required:true,
index:true
},

originalLastName:{
type:String,
required:true,
index:true
},

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

identityKey:{
type:String,
index:true,
default:null
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

/* 4 DEFENDER */

"4-4-2",
"4-3-3",
"4-2-3-1",
"4-4-2-diamond",
"4-1-4-1",

/* 3 DEFENDER */

"3-5-2",
"3-4-2-1",
"3-4-3",

/* 5 DEFENDER */

"5-4-1",
"5-3-2",
"5-2-1-2"

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

transferProfile:{
type:String,
enum:[
"youth_developer",
"star_collector",
"pressing_builder",
"tactical_builder",
"defensive_builder",
"balanced"
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
COACH DNA (ENGINE MULTIPLIERS)
===================================== */

coachDNA:{

tempo:{
type:Number,
min:0,
max:1,
default:0.5
},

pressing:{
type:Number,
min:0,
max:1,
default:0.5
},

width:{
type:Number,
min:0,
max:1,
default:0.5
},

directness:{
type:Number,
min:0,
max:1,
default:0.5
},

risk:{
type:Number,
min:0,
max:1,
default:0.5
},

defensiveLine:{
type:Number,
min:0,
max:1,
default:0.5
}

},

/* =====================================
TACTICAL PROFILE
===================================== */

pressingHeight:{
type:Number,
min:0,
max:100,
default:50
},

defensiveLine:{
type:Number,
min:0,
max:100,
default:50
},

possessionTempo:{
type:Number,
min:0,
max:100,
default:50
},

buildUpSpeed:{
type:Number,
min:0,
max:100,
default:50
},

attackWidth:{
type:Number,
min:0,
max:100,
default:50
},

counterRisk:{
type:Number,
min:0,
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
