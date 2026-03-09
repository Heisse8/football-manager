const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({

/* ================= BASIS ================= */

firstName:{
type:String,
required:true,
trim:true,
maxlength:30
},

lastName:{
type:String,
required:true,
trim:true,
maxlength:30
},

nationality:{
type:String,
required:true,
index:true
},

age:{
type:Number,
required:true,
min:16,
max:40,
index:true
},

/* ================= POSITIONEN ================= */

positions:{
type:[String],
required:true,
index:true
},

/* ================= PLAYSTYLE ================= */

playStyle:{
type:String,
enum:[
"finisher",
"targetman",
"poacher",
"playmaker",
"winger",
"box_to_box",
"ball_winner",
"deep_playmaker",
"sweeper_keeper",
"defensive_wall"
],
default:null
},

/* ================= RATING ================= */

stars:{
type:Number,
required:true,
min:0.5,
max:5,
index:true
},

potential:{
type:Number,
min:0.5,
max:5,
default:2.5,
index:true
},

/* ================= MARKTWERT ================= */

marketValue:{
type:Number,
default:0,
index:true
},

/* ================= MATCH ENGINE ATTRIBUTE ================= */

pace:{ type:Number, min:0, max:99, default:50 },
shooting:{ type:Number, min:0, max:99, default:50 },
passing:{ type:Number, min:0, max:99, default:50 },
defending:{ type:Number, min:0, max:99, default:50 },
physical:{ type:Number, min:0, max:99, default:50 },
mentality:{ type:Number, min:0, max:99, default:50 },

/* ================= MATCH ZUSTAND ================= */

fitness:{
type:Number,
min:0,
max:100,
default:100
},

morale:{
type:Number,
min:0,
max:100,
default:70
},

/* ================= VERLETZUNG / SPERREN ================= */

injuredUntil:{
type:Date,
default:null,
index:true
},

suspendedUntil:{
type:Date,
default:null
},

yellowCards:{
type:Number,
default:0
},

redCards:{
type:Number,
default:0
},

/* ================= MATCH STATISTIK ================= */

seasonStats:{

games:{ type:Number, default:0 },

goals:{ type:Number, default:0 },

assists:{ type:Number, default:0 },

rating:{ type:Number, default:6.5 },

cleanSheets:{ type:Number, default:0 },

saves:{ type:Number, default:0 }

},

/* ================= KARRIERE STATISTIK ================= */

careerStats:{

games:{ type:Number, default:0 },

goals:{ type:Number, default:0 },

assists:{ type:Number, default:0 },

cleanSheets:{ type:Number, default:0 },

saves:{ type:Number, default:0 }

},

/* ================= AUFSTELLUNG ================= */

startingXI:{
type:Boolean,
default:false
},

bench:{
type:Boolean,
default:false
},

lineupSlot:{
type:String,
default:null
},

/* ================= TRANSFERMARKT ================= */

isListed:{
type:Boolean,
default:false,
index:true
},

transferType:{
type:String,
enum:["instant","auction"],
default:"instant"
},

transferPrice:{
type:Number,
default:0
},

auctionEnd:{
type:Date,
default:null
},

highestBid:{
type:Number,
default:0
},

highestBidder:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
},

sellerTeam:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null
},

/* ================= TEAM ================= */

team:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null,
index:true
}

},{
timestamps:true
});

/* ================= PERFORMANCE INDEXES ================= */

playerSchema.index({ team:1 });
playerSchema.index({ isListed:1 });
playerSchema.index({ stars:-1 });
playerSchema.index({ marketValue:-1 });
playerSchema.index({ nationality:1 });

module.exports = mongoose.model("Player",playerSchema);