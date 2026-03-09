const mongoose = require("mongoose");

const transferBidSchema = new mongoose.Schema({

/* =====================================================
PLAYER
===================================================== */

player:{
type:mongoose.Schema.Types.ObjectId,
ref:"Player",
required:true,
index:true
},

/* =====================================================
BIDDER TEAM
===================================================== */

bidder:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
required:true,
index:true
},

/* =====================================================
BID AMOUNT
===================================================== */

amount:{
type:Number,
required:true,
min:1
},

/* =====================================================
TRANSFER AUCTION
===================================================== */

transfer:{
type:mongoose.Schema.Types.ObjectId,
ref:"Transfer",
default:null,
index:true
}

},{timestamps:true});

transferBidSchema.index({ player: 1 });

transferBidSchema.index({ bidder: 1 });

transferBidSchema.index({ createdAt: -1 });

module.exports = mongoose.model("TransferBid", transferBidSchema);