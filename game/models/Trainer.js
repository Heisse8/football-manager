const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

rating:{
type:Number,
min:1,
max:5,
default:2
},

preferredFormation:{
type:String,
enum:[
"442",
"4231",
"433",
"41212",
"4141",
"352",
"343",
"3421",
"532",
"541",
"5212"
],
default:"442"
},

playStyle:{
type:String,
enum:[
"ballbesitz",
"gegenpressing",
"konter",
"defensiv"
],
default:"ballbesitz"
},

personality:{
type:String,
enum:[
"offensiv",
"ausgeglichen",
"defensiv"
],
default:"ausgeglichen"
},

youthFocus:{
type:Number,
min:0,
max:1,
default:0.4
},

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
}

},{timestamps:true});

module.exports = mongoose.model("Trainer",trainerSchema);