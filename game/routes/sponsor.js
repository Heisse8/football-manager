const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const Team = require("../models/Team");

const {
generateSponsorOffers,
acceptSponsor
} = require("../services/sponsorService");

/* =====================================================
SPONSOR ANGEBOTE
GET /api/sponsor/offers
===================================================== */

router.get("/offers", auth, async (req,res)=>{

try{

/* ================= TEAM LADEN ================= */

const team = await Team.findOne({
owner:req.user.userId
}).lean();

if(!team){
return res.status(404).json({
message:"Team nicht gefunden"
});
}

/* ================= ANGEBOTE ================= */

const offers = generateSponsorOffers(team);

res.json({
offers
});

}catch(err){

console.error("Sponsor Offers Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
SPONSOR ANNEHMEN
POST /api/sponsor/accept
===================================================== */

router.post("/accept", auth, async (req,res)=>{

try{

const { sponsor } = req.body;

/* ================= VALIDATION ================= */

if(!sponsor){

return res.status(400).json({
message:"Sponsor fehlt"
});

}

/* ================= TEAM LADEN ================= */

const team = await Team.findOne({
owner:req.user.userId
});

if(!team){

return res.status(404).json({
message:"Team nicht gefunden"
});

}

/* ================= SPONSOR ANNEHMEN ================= */

const updatedTeam = await acceptSponsor(team._id, sponsor);

/* ================= RESPONSE ================= */

res.json({
success:true,
team:updatedTeam
});

}catch(err){

console.error("Sponsor Accept Fehler:",err);

res.status(400).json({
message:err.message || "Sponsor konnte nicht angenommen werden"
});

}

});

module.exports = router;