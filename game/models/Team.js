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
default:8
},

stadiumLevel:{
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
Trainer kann diese später überschreiben
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

/* =====================================================
LINEUP (vom Trainer generiert)
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
TEAM STRENGTH
MatchEngine Basis
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
default:1000000
},

lastMatchRevenue:{
type:Number,
default:0
},

/* ================= SPONSOR ================= */

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
type:Object,
default:null
},

sponsorGamesLeft:{
type:Number,
default:0
}

},{timestamps:true});

module.exports = mongoose.model("Team",teamSchema);