const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({

/* =====================================================
TYPE
===================================================== */

type:{
type:String,
enum:["player","manager","scout"],
required:true,
index:true
},

/* =====================================================
ITEM
===================================================== */

item:{
type:mongoose.Schema.Types.ObjectId,
required:true,
index:true
},

/* =====================================================
SELLER
===================================================== */

seller:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null,
index:true
},

/* =====================================================
PRICES
===================================================== */

startPrice:{
type:Number,
required:true,
min:0
},

currentBid:{
type:Number,
default:0,
min:0
},

highestBidder:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
},

/* =====================================================
STATUS
===================================================== */

status:{
type:String,
enum:["active","finished","cancelled"],
default:"active",
index:true
},

/* =====================================================
TIME
===================================================== */

expiresAt:{
type:Date,
required:true,
index:true
}

},{timestamps:true});

/* =====================================================
INDEXES
===================================================== */

transferSchema.index({ expiresAt:1 });
transferSchema.index({ status:1 });
transferSchema.index({ type:1 });

module.exports = mongoose.model("Transfer", transferSchema);