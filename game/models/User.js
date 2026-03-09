const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

/* =====================================================
USERNAME
===================================================== */

username:{
type:String,
required:true,
trim:true,
minlength:3,
maxlength:20
},

/* =====================================================
EMAIL
===================================================== */

email:{
type:String,
required:true,
unique:true,
lowercase:true,
trim:true,
index:true
},

/* =====================================================
PASSWORD
===================================================== */

password:{
type:String,
required:true
},

/* =====================================================
EMAIL VERIFICATION
===================================================== */

isVerified:{
type:Boolean,
default:false
},

verificationToken:{
type:String,
default:null
},

/* =====================================================
REFRESH TOKEN SYSTEM
===================================================== */

refreshToken:{
type:String,
default:null
},

/* =====================================================
PASSWORD RESET
===================================================== */

passwordResetToken:{
type:String,
default:null
},

passwordResetExpires:{
type:Date,
default:null
},

/* =====================================================
TEAM / CLUB
===================================================== */

club:{
type:mongoose.Schema.Types.ObjectId,
ref:"Team",
default:null,
index:true
}

},{timestamps:true});

/* =====================================================
INDEXES
===================================================== */

userSchema.index({ email:1 });
userSchema.index({ club:1 });

module.exports = mongoose.model("User", userSchema);