const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
required:true,
index:true
},

title:{
type:String,
required:true
},

message:{
type:String,
required:true
},

type:{
type:String,
default:"info"
},

isRead:{
type:Boolean,
default:false,
index:true
}

},{
timestamps:true
});

module.exports = mongoose.model("Notification", notificationSchema);