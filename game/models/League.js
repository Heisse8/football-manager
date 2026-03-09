const mongoose = require("mongoose");

const leagueSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

country:{
type:String,
required:true
},

level:{
type:Number,
default:1
},

teams:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"Team"
}
],

currentMatchday:{
type:Number,
default:1
},

season:{
type:String,
default:"2026"
}

},{
timestamps:true
});

module.exports = mongoose.model("League", leagueSchema);