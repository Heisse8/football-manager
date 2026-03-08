const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({

title:{
type:String,
required:true
},

content:{
type:String,
required:true
},

league:{
type:String,
default:null
},

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
},

type:{
type:String,
enum:[
"transfer",
"match",
"injury",
"sack",
"milestone",
"league"
],
default:"match"
},

importance:{
type:Number,
default:1
},

},{timestamps:true});

module.exports = mongoose.model("News",newsSchema);