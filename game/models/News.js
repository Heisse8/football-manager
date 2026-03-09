const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({

/* =====================================
TITLE
===================================== */

title:{
type:String,
required:true,
trim:true,
maxlength:120
},

/* =====================================
CONTENT
===================================== */

content:{
type:String,
required:true,
trim:true
},

/* =====================================
LEAGUE
===================================== */

league:{
type:String,
default:null,
index:true
},

/* =====================================
TEAM
===================================== */

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null,
index:true
},

/* =====================================
NEWS TYPE
===================================== */

type:{
type:String,
enum:[
"transfer",
"match",
"injury",
"sack",
"milestone",
"league"
],
default:"match",
index:true
},

/* =====================================
IMPORTANCE
===================================== */

importance:{
type:Number,
min:1,
max:5,
default:1,
index:true
},

/* =====================================
OPTIONAL PLAYER
===================================== */

player:{
type:mongoose.Schema.Types.ObjectId,
ref:"Player",
default:null
}

},{
timestamps:true
});

/* =====================================
INDEXES
===================================== */

newsSchema.index({ league:1, createdAt:-1 });
newsSchema.index({ team:1, createdAt:-1 });

module.exports = mongoose.model("News",newsSchema);