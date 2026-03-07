const mongoose = require("mongoose");

const stadiumSchema = new mongoose.Schema({

/* =====================================================
TEAM
===================================================== */

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
required:true
},

/* =====================================================
BASIS
===================================================== */

name:{
type:String,
default:"Vereinsstadion"
},

nameLocked:{
type:Boolean,
default:false
},

capacity:{
type:Number,
default:10000
},

ticketPrice:{
type:Number,
default:15
},

/* =====================================================
FAN EXPERIENCE
===================================================== */

fanComfort:{
type:Number,
default:1
},

atmosphere:{
type:Number,
default:1
},

/* =====================================================
CONSTRUCTION
===================================================== */

construction:{

inProgress:{
type:Boolean,
default:false
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
default:null
}

}

},{timestamps:true});

module.exports = mongoose.model("Stadium", stadiumSchema);