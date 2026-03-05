const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({

type:{
type:String,
enum:["player","manager","scout"],
required:true
},

item:{
type:mongoose.Schema.Types.ObjectId,
required:true
},

seller:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
},

startPrice:{
type:Number,
required:true
},

currentBid:{
type:Number,
default:0
},

highestBidder:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
},

status:{
type:String,
enum:["active","finished"],
default:"active"
},

expiresAt:{
type:Date,
required:true
}

},{timestamps:true});

module.exports = mongoose.model("Transfer", transferSchema);