const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const auth = require("../middleware/auth");

const { generateSponsors } = require("../utils/sponsorGenerator");

/* ================= GET SPONSORS ================= */

router.get("/", auth, async (req,res)=>{

try{

const team = await Team.findOne({
owner:req.user.userId
});

if(!team){
return res.status(404).json({
message:"Team nicht gefunden"
});
}

const sponsors = generateSponsors(team);

res.json(sponsors);

}catch(err){

console.error(err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* ================= SIGN SPONSOR ================= */

router.post("/sign", auth, async (req,res)=>{

try{

const { sponsor } = req.body;

const team = await Team.findOne({
owner:req.user.userId
});

team.sponsor = sponsor.name;
team.sponsorPayment = sponsor.payment;
team.sponsorGamesLeft = sponsor.duration;

await team.save();

res.json({success:true});

}catch(err){

console.error(err);

res.status(500).json({
message:"Serverfehler"
});

}

});

module.exports = router;