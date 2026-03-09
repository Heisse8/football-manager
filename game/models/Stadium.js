 const mongoose = require("mongoose");

const stadiumSchema = new mongoose.Schema({

/* =====================================================
TEAM
===================================================== */

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
required:true,
unique:true,
index:true
},

/* =====================================================
BASIS
===================================================== */

name:{
type:String,
default:"Vereinsstadion",
trim:true,
maxlength:40
},

nameLocked:{
type:Boolean,
default:false
},

capacity:{
type:Number,
default:10000,
min:1000
},

ticketPrice:{
type:Number,
default:15,
min:5,
max:200
},

/* =====================================================
FAN EXPERIENCE
===================================================== */

fanComfort:{
type:Number,
default:1,
min:0.5,
max:2
},

atmosphere:{
type:Number,
default:1,
min:0.5,
max:2
},

/* =====================================================
CONSTRUCTION
===================================================== */

construction:{

inProgress:{
type:Boolean,
default:false,
index:true
},

targetCapacity:{
type:Number,
default:null
},

startDate:{
type:Date,
default:null
},

finishDate:{
type:Date,
default:null,
index:true
}

}

},{timestamps:true});

/* =====================================================
INDEXES
===================================================== */

stadiumSchema.index({ team:1 });
stadiumSchema.index({ "construction.finishDate":1 });

module.exports = mongoose.model("Stadium", stadiumSchema);