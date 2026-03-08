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
===================================================== */

router.get("/offers", auth, async (req,res)=>{

try{

const team = await Team.findOne({
owner:req.user.userId
});

const offers = generateSponsorOffers(team);

res.json(offers);

}catch(err){

res.status(500).json({message:"Serverfehler"});

}

});

/* =====================================================
SPONSOR ANNEHMEN
===================================================== */

router.post("/accept", auth, async (req,res)=>{

try{

const { sponsor } = req.body;

const team = await Team.findOne({
owner:req.user.userId
});

const result = await acceptSponsor(team._id,sponsor);

res.json(result);

}catch(err){

res.status(400).json({message:err.message});

}

});

module.exports = router;