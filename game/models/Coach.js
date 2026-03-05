const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({

firstName:{
type:String,
required:true
},

lastName:{
type:String,
required:true
},

nationality:{
type:String
},

stars:{
type:Number,
min:0.5,
max:5,
default:2
},

style:{
type:String,
enum:[
"possession",
"gegenpress",
"counter",
"defensive",
"balanced"
],
default:"balanced"
},

favoriteFormation:{
type:String,
enum:[
"433",
"4231",
"442",
"41212",
"4141",
"352",
"343",
"3421",
"532",
"541",
"5212"
],
default:"433"
},

adaptability:{
type:Number,
min:0,
max:100,
default:50
},

attackBias:{
type:Number,
min:0,
max:100,
default:50
},

defenseBias:{
type:Number,
min:0,
max:100,
default:50
},

substitutionAggression:{
type:Number,
min:0,
max:100,
default:50
}

},{timestamps:true});

module.exports = mongoose.model("Coach",coachSchema);