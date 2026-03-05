const express = require("express");
const router = express.Router();

const Scout = require("../models/Scout");
const Team = require("../models/Team");

const auth = require("../middleware/auth");

router.post("/mission", auth, async (req,res)=>{

try{

const { scoutId, region, duration } = req.body;

const team = await Team.findOne({
owner:req.user.userId
});

const scout = await Scout.findById(scoutId);

if(!scout || scout.team.toString() !== team._id.toString()){

return res.status(400).json({
message:"Scout gehört nicht deinem Team"
});

}

if(scout.busyUntil){

return res.status(400).json({
message:"Scout ist bereits unterwegs"
});

}

/* MAX 5 SCOUTS */

const scouts = await Scout.countDocuments({
team:team._id
});

if(scouts > 5){

return res.status(400).json({
message:"Maximal 5 Scouts erlaubt"
});

}

/* KOSTEN */

let cost = 50000;

if(duration === 7) cost = 120000;
if(duration === 14) cost = 220000;

if(team.balance < cost){

return res.status(400).json({
message:"Nicht genug Geld"
});

}

team.balance -= cost;

const end = new Date();
end.setDate(end.getDate()+duration);

scout.busyUntil = end;

scout.mission = {
region,
duration
};

await team.save();
await scout.save();

res.json({
success:true
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Serverfehler"
});

}

});

module.exports = router;