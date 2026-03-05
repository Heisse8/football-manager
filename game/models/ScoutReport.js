const mongoose = require("mongoose");

const scoutReportSchema = new mongoose.Schema({

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
required:true
},

scout:{
type:mongoose.Schema.Types.ObjectId,
ref:"Scout"
},

players:{
type:Array,
default:[]
},

expiresAt:{
type:Date
}

},{timestamps:true});

module.exports = mongoose.model("ScoutReport", scoutReportSchema);