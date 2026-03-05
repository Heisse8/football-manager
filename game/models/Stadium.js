const mongoose = require("mongoose");

const stadiumSchema = new mongoose.Schema({

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
required:true
},

capacity:{
type:Number,
default:10000
},

ticketPrice:{
type:Number,
default:15
},

fanComfort:{
type:Number,
default:1
},

atmosphere:{
type:Number,
default:1
}

},{timestamps:true});

module.exports = mongoose.model("Stadium", stadiumSchema);