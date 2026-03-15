const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({

/* =====================================================
BASIS
===================================================== */

name:{
type:String,
required:true
},

shortName:{
type:String,
required:true
},

owner:{
type: mongoose.Schema.Types.ObjectId,
ref: "User",
unique: true,
index: true
},

league:{
type:String,
required:true,
index:true
},

country:{
type:String,
required:true
},

/* =====================================================
SQUAD
===================================================== */

players:[{
type:mongoose.Schema.Types.ObjectId,
ref:"Player"
}],

coach:{
type:mongoose.Schema.Types.ObjectId,
ref:"Coach",
default:null
},

assistantCoach:{
type:mongoose.Schema.Types.ObjectId,
ref:"Coach",
default:null
},

/* =====================================================
BOT SYSTEM
===================================================== */

isBot:{
type:Boolean,
default:false,
index:true
},

/* =====================================================
SCOUTING SYSTEM
===================================================== */

scoutingLevel:{
type:Number,
default:1,
min:1,
max:5
},

scoutSlots:{
type:Number,
default:3
},

scouts:[{
type:mongoose.Schema.Types.ObjectId,
ref:"Scout"
}],

/* =====================================================
STADIUM SYSTEM
===================================================== */

stadiumName:{
type:String,
default:"Vereinsstadion"
},

stadiumCapacity:{
type:Number,
default:12000,
min:1000
},

ticketPrice:{
type:Number,
default:18,
min:5,
max:200
},

/* =====================================================
FANS & HOME ADVANTAGE
===================================================== */

fanBase:{
type:Number,
default:1,
min:0.5,
max:5
},

homeBonus:{
type:Number,
default:1,
min:0.5,
max:2
},

/* =====================================================
TACTICS
===================================================== */

tactics:{

playStyle:{
type:String,
enum:["ballbesitz","konter","gegenpressing","mauern"],
default:"ballbesitz"
},

pressing:{
type:String,
enum:["sehr_hoch","hoch","mittel","low_block"],
default:"mittel"
},

defensiveLine:{
type:String,
enum:["hoch","mittel","tief"],
default:"mittel"
},

passingStyle:{
type:String,
enum:["kurz","variabel","lang"],
default:"variabel"
},

tempo:{
type:String,
enum:["langsam","kontrolliert","hoch","sehr_hoch"],
default:"kontrolliert"
},

width:{
type:String,
enum:["sehr_eng","eng","normal","breit"],
default:"normal"
}

},

/* =====================================================
FORMATION
===================================================== */

formation:{
type:String,
default:"4-4-2"
},

/* =====================================================
LINEUP
===================================================== */

lineup:{
type:Map,
of:mongoose.Schema.Types.ObjectId,
default:{}
},

bench:[{
type:mongoose.Schema.Types.ObjectId,
ref:"Player"
}],

benchLimit:{
type:Number,
default:7
},

/* =====================================================
TEAM STRENGTH
===================================================== */

attackStrength:{
type:Number,
default:50
},

defenseStrength:{
type:Number,
default:50
},

possessionSkill:{
type:Number,
default:50
},

/* =====================================================
TEAM CHEMISTRY
===================================================== */

teamChemistry:{
type:Number,
default:70,
min:0,
max:100
},

clubReputation:{
type:Number,
default:50,
index:true
},

/* =====================================================
TABLE
===================================================== */

played:{ type:Number, default:0 },

points:{ type:Number, default:0, index:true },

wins:{ type:Number, default:0 },
draws:{ type:Number, default:0 },
losses:{ type:Number, default:0 },

goalsFor:{ type:Number, default:0 },
goalsAgainst:{ type:Number, default:0 },

goalDifference:{ type:Number, default:0 },

tablePosition:{ type:Number, default:0 },

/* =====================================================
FINANCE
===================================================== */

balance:{
type:Number,
default:50000000,
index:true
}

},{
timestamps:true
});

/* =====================================================
INDEXES
===================================================== */

teamSchema.index({ owner: 1 });
teamSchema.index({ league: 1 });
teamSchema.index({ points: -1 });
teamSchema.index({ tablePosition: 1 });

module.exports = mongoose.model("Team",teamSchema);
