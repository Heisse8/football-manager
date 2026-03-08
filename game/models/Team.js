const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({

/* =====================================================
BASIS
===================================================== */

name:{
type:String,
required:true,
unique:true
},

shortName:{
type:String,
required:true,
unique:true
},

country:{
type:String,
required:true
},

league:{
type:String,
required:true
},

owner:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
default:null
},

createdAtLeague:{
type:Date,
default:Date.now
},

/* =====================================================
BOT SYSTEM
===================================================== */

isBot:{
type:Boolean,
default:false
},

/* =====================================================
TRAINER SYSTEM
===================================================== */

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

scouts:{
type:[{
type:mongoose.Schema.Types.ObjectId,
ref:"Scout"
}],
default:[]
},

activeScouting:{
type:[{
scout:{
type:mongoose.Schema.Types.ObjectId,
ref:"Scout"
},
region:{
type:String
},
duration:{
type:Number
},
startedAt:{
type:Date
},
returnAt:{
type:Date
}
}],
default:[]
},

/* =====================================================
CLUB IDENTITY
===================================================== */

clubIdentity:{
type:String,
enum:["love","commercial"],
default:"love"
},

/* =====================================================
STADIUM SYSTEM
===================================================== */

stadiumName:{
type:String,
default:"Vereinsstadion"
},

stadiumCapacity:{
type:Number,
default:12000
},

ticketPrice:{
type:Number,
default:18
},

stadiumLevel:{
type:Number,
default:1
},

trainingLevel:{
type:Number,
default:1
},

medicalLevel:{
type:Number,
default:1
},

/* =====================================================
FANS & HOME ADVANTAGE
===================================================== */

fanBase:{
type:Number,
default:1
},

homeBonus:{
type:Number,
default:1
},

/* =====================================================
TAKTIK
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
},

transitionAfterWin:{
type:String,
enum:["vertikal","kontrolliert","fluegel"],
default:"kontrolliert"
},

transitionAfterLoss:{
type:String,
enum:["gegenpressing","mittelfeldpressing","rueckzug"],
default:"mittelfeldpressing"
},

mentality:{
type:String,
enum:["defensiv","ausgewogen","offensiv","sehr_offensiv"],
default:"ausgewogen"
}

},

/* =====================================================
FORMATION
===================================================== */

formation:{
type:String,
enum:[
"4-4-2",
"4-2-3-1",
"4-3-3",
"4-1-2-1-2",
"4-1-4-1",
"3-5-2",
"3-4-3",
"3-4-2-1",
"5-3-2",
"5-4-1",
"5-2-1-2"
],
default:"4-4-2"
},

/* =====================================================
LINEUP
===================================================== */

lineup:{
type:Object,
default:{}
},

bench:{
type:[mongoose.Schema.Types.ObjectId],
ref:"Player",
default:[]
},

benchLimit:{
type:Number,
default:7
},

/* =====================================================
LINEUP LOCK SYSTEM
===================================================== */

lineupLocked:{
type:Boolean,
default:false
},

lockedLineup:{
type:Object,
default:{}
},

lockedBench:{
type:[mongoose.Schema.Types.ObjectId],
ref:"Player",
default:[]
},

/* =====================================================
MATCHDAY SYSTEM
===================================================== */

currentMatchday:{
type:Number,
default:1
},

lastMatch:{
type:Date,
default:null
},

/* =====================================================
SEASON SYSTEM
===================================================== */

seasonReady:{
type:Boolean,
default:false
},

seasonPaused:{
type:Boolean,
default:false
},

season:{
type:Number,
default:1
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
TEAM DYNAMICS
===================================================== */

teamChemistry:{
type:Number,
default:70
},

clubReputation:{
type:Number,
default:50
},

/* =====================================================
TABELLE
===================================================== */

played:{ type:Number, default:0 },

points:{ type:Number, default:0 },

wins:{ type:Number, default:0 },
draws:{ type:Number, default:0 },
losses:{ type:Number, default:0 },

goalsFor:{ type:Number, default:0 },
goalsAgainst:{ type:Number, default:0 },

goalDifference:{ type:Number, default:0 },

tablePosition:{ type:Number, default:0 },

/* =====================================================
FINANZEN
===================================================== */

balance:{
type:Number,
default:50000000
},

lastMatchRevenue:{
type:Number,
default:0
},

transferIncome:{
type:Number,
default:0
},

transferSpending:{
type:Number,
default:0
},

/* =====================================================
SPONSOR SYSTEM
===================================================== */

sponsor:{
type:String,
default:null
},

sponsorPayment:{
type:Number,
default:0
},

sponsorWinBonus:{
type:Number,
default:0
},

sponsorSeasonBonus:{

top10:{ type:Number, default:0 },
top5:{ type:Number, default:0 },
top3:{ type:Number, default:0 },
champion:{ type:Number, default:0 }

},

sponsorReputation:{
type:Number,
default:1
},

lastSeasonPosition:{
type:Number,
default:10
},

sponsorGamesLeft:{
type:Number,
default:0
}

},{timestamps:true});

module.exports = mongoose.model("Team",teamSchema);