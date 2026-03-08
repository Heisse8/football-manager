const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({

/* =====================================================
TEAMS
===================================================== */

homeTeam:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team"
},

awayTeam:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team"
},

/* =====================================================
DATUM
===================================================== */

date:Date,

matchday:{
type:Number,
default:null
},

/* =====================================================
WETTBEWERB
===================================================== */

competition:{
type:String,
enum:["league","cup","ucl"],
default:"league"
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
SPIELERGEBNIS
===================================================== */

homeGoals:{
type:Number,
default:0
},

awayGoals:{
type:Number,
default:0
},

/* Verlängerung */

extraTime:{
played:{
type:Boolean,
default:false
},
homeGoals:{
type:Number,
default:0
},
awayGoals:{
type:Number,
default:0
}
},

/* Elfmeterschießen */

penalties:{
played:{
type:Boolean,
default:false
},
home:{
type:Number,
default:0
},
away:{
type:Number,
default:0
}
},

/* =====================================================
POSSESSION
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
default:"scheduled"
},

played:{
type:Boolean,
default:false
},

createdAt:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("Match",matchSchema);