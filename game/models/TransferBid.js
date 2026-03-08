const mongoose = require("mongoose");

const transferBidSchema = new mongoose.Schema({

player:{
type:mongoose.Schema.Types.ObjectId,
ref:"Player",
required:true
},

bidder:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
required:true
},

amount:{
type:Number,
required:true
}

},{timestamps:true});

module.exports = mongoose.model("TransferBid",transferBidSchema);