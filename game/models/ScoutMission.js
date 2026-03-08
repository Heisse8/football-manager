const mongoose = require("mongoose");

const scoutMissionSchema = new mongoose.Schema({

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
required:true
},

scout:{
type:mongoose.Schema.Types.ObjectId,
ref:"Scout",
required:true
},

region:{
type:String,
required:true
},

duration:{
type:Number,
required:true
},

endsAt:{
type:Date,
required:true
},

results:{
type:[Object],
default:[]
},

isResolved:{
type:Boolean,
default:false
}

},{timestamps:true});

module.exports = mongoose.model("ScoutMission",scoutMissionSchema);