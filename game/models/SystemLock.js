const mongoose = require("mongoose");

const schema = new mongoose.Schema({

key:{
type:String,
unique:true
},

locked:{
type:Boolean,
default:false
},

lockedAt:{
type:Date
}

});

module.exports = mongoose.model("SystemLock", schema);