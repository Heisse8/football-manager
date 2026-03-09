const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema({

/* =====================================
SEASON NUMBER
===================================== */

seasonNumber:{
type:Number,
required:true,
index:true
},

/* =====================================
MATCHDAYS
===================================== */

currentMatchday:{
type:Number,
default:0,
min:0
},

totalMatchdays:{
type:Number,
default:34
},

/* =====================================
DATES
===================================== */

seasonStart:{
type:Date,
required:true,
index:true
},

seasonEnd:{
type:Date,
required:true
},

/* =====================================
TRANSFER WINDOWS
===================================== */

transferWindowOpen:{
type:Boolean,
default:true
},

winterTransferOpen:{
type:Boolean,
default:false
},

/* =====================================
STATUS
===================================== */

status:{
type:String,
enum:["preseason","running","finished"],
default:"preseason",
index:true
}

},{timestamps:true});

/* =====================================
INDEXES
===================================== */

seasonSchema.index({ seasonNumber:1 });
seasonSchema.index({ status:1 });

module.exports = mongoose.model("Season", seasonSchema);