const mongoose = require("mongoose");

const scoutMissionSchema = new mongoose.Schema({

/* =====================================
TEAM
===================================== */

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
required:true,
index:true
},

/* =====================================
SCOUT
===================================== */

scout:{
type:mongoose.Schema.Types.ObjectId,
ref:"Scout",
required:true,
index:true
},

/* =====================================
MISSION
===================================== */

region:{
type:String,
required:true,
enum:[
"europa",
"suedamerika",
"afrika",
"asien",
"nordamerika",
"australien"
],
index:true
},

duration:{
type:Number,
required:true
},

endsAt:{
type:Date,
required:true,
index:true
},

/* =====================================
RESULTS
===================================== */

results:[{
player:{
type:mongoose.Schema.Types.ObjectId,
ref:"Player"
},

potential:{
type:Number,
min:0.5,
max:5
},

stars:{
type:Number,
min:0.5,
max:5
},

note:{
type:String,
default:null
}

}],

/* =====================================
STATUS
===================================== */

isResolved:{
type:Boolean,
default:false,
index:true
}

},{
timestamps:true
});

/* =====================================
INDEXES
===================================== */

scoutMissionSchema.index({ team:1, isResolved:1 });
scoutMissionSchema.index({ scout:1 });
scoutMissionSchema.index({ endsAt:1 });

module.exports = mongoose.model("ScoutMission",scoutMissionSchema);