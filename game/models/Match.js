const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({

/* =====================================================
TEAMS
===================================================== */

homeTeam:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
required:true,
index:true
},

awayTeam:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
required:true,
index:true
},

/* =====================================================
DATUM
===================================================== */

date:{
type:Date,
required:true,
index:true
},

matchday:{
type:Number,
default:null,
index:true
},

/* =====================================================
WETTBEWERB
===================================================== */

competition:{
type:String,
enum:["league","cup","ucl"],
default:"league",
index:true
},

/* =====================================================
POKAL RUNDE
===================================================== */

cupRound:{
type:String,
enum:[
"runde1",
"achtelfinale",
"viertelfinale",
"halbfinale",
"finale"
],
default:null
},

/* =====================================================
CHAMPIONS LEAGUE
===================================================== */

group:{
type:String,
enum:["A","B","C","D"],
default:null
},

leg:{
type:Number,
default:1
},

/* =====================================================
ERGEBNIS
===================================================== */

homeGoals:{
type:Number,
default:0
},

awayGoals:{
type:Number,
default:0
},

/* =====================================================
VERLÄNGERUNG
===================================================== */

extraTime:{
played:{ type:Boolean, default:false },
homeGoals:{ type:Number, default:0 },
awayGoals:{ type:Number, default:0 }
},

/* =====================================================
ELFMETERSCHIESSEN
===================================================== */

penalties:{
played:{ type:Boolean, default:false },
home:{ type:Number, default:0 },
away:{ type:Number, default:0 }
},

/* =====================================================
BALLBESITZ
===================================================== */

possession:{
home:{ type:Number, default:50 },
away:{ type:Number, default:50 }
},

/* =====================================================
EXPECTED GOALS
===================================================== */

xG:{
home:{ type:Number, default:0 },
away:{ type:Number, default:0 }
},

/* =====================================================
MATCH STATS
===================================================== */

stats:{

shots:{
home:{ type:Number, default:0 },
away:{ type:Number, default:0 }
},

corners:{
home:{ type:Number, default:0 },
away:{ type:Number, default:0 }
},

freeKicks:{
home:{ type:Number, default:0 },
away:{ type:Number, default:0 }
},

penalties:{
home:{ type:Number, default:0 },
away:{ type:Number, default:0 }
},

cards:{

home:{
yellows:{ type:Number, default:0 },
reds:{ type:Number, default:0 }
},

away:{
yellows:{ type:Number, default:0 },
reds:{ type:Number, default:0 }
}

}

},

/* =====================================================
MATCH INFO
===================================================== */

summary:{
type:String,
default:null
},

attendance:{
type:Number,
default:0
},

/* =====================================================
MATCH STATUS
===================================================== */

status:{
type:String,
enum:["scheduled","live","finished"],
default:"scheduled",
index:true
},

played:{
type:Boolean,
default:false,
index:true
}

},{
timestamps:true
});

/* =====================================================
INDEXES (Performance)
===================================================== */

matchSchema.index({ homeTeam:1, date:1 });
matchSchema.index({ awayTeam:1, date:1 });
matchSchema.index({ competition:1, matchday:1 });

module.exports = mongoose.model("Match",matchSchema);