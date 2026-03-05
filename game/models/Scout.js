const mongoose = require("mongoose");

const scoutSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

stars:{
type:Number,
min:1,
max:5,
required:true
},

region:{
type:String,
default:"global"
},

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
},

busyUntil:{
type:Date,
default:null
},

mission:{
region:String,
duration:Number
}

},{timestamps:true});

module.exports = mongoose.model("Scout", scoutSchema);