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
enum:[
"GK",
"CB",
"LB",
"RB",
"LWB",
"RWB",
"CDM",
"CM",
"CAM",
"LW",
"RW",
"ST"
],
index:true
},

/* ================= PLAYSTYLE ================= */

playstyles:{
type:[String],
enum:[

/* GOALKEEPER */
"sweeper_keeper",
"shot_stopper",

/* CENTER BACK */
"ball_playing_cb",
"stopper_cb",
"interceptor_cb",

/* FULLBACK */
"wingback",
"inverted_fullback",
"defensive_fullback",

/* DEFENSIVE MIDFIELD */
"anchor_man",
"deep_playmaker",

/* CENTRAL MIDFIELD */
"box_to_box",
"control_cm",
"dribbling_cm",
"offensive_cm",

/* ATTACKING MIDFIELD */
"playmaker_cam",
"shadow_striker",
"dribbling_cam",
"free_roamer",

/* WINGERS */
"inside_forward",
"crossing_winger",
"dribble_winger",

/* STRIKERS */
"target_man",
"poacher",
"false_9",
"speed_striker"

],
default:[]
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

playerSchema.pre("save", function(){

if(!this.marketValue || this.marketValue === 0){

let value = this.stars * 2000000;

value += this.potential * 500000;

if(this.age <= 21) value *= 1.5;
if(this.age >= 30) value *= 0.7;

if(this.stars >= 4.5) value *= 2;

this.marketValue = Math.round(value);

}

});

/* =====================================================
INDEXES (PERFORMANCE)
===================================================== */

playerSchema.index({ transferType: 1 });

playerSchema.index({ auctionEnd: 1 });

playerSchema.index({ marketValue: -1 });

playerSchema.index({ stars: -1 });

module.exports = mongoose.model("Player",playerSchema);