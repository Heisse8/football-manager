const express = require("express");
const router = express.Router();

const Scout = require("../models/Scout");
const Team = require("../models/Team");
const ScoutMission = require("../models/ScoutMission");
const Player = require("../models/Player");

const auth = require("../middleware/auth");

/* =====================================================
START SCOUT MISSION
POST /api/scout/mission
===================================================== */

router.post("/mission", auth, async (req,res)=>{

try{

const { scoutId, region, duration } = req.body;

/* ================= TEAM + SCOUT LADEN ================= */

const [team, scout] = await Promise.all([
Team.findOne({ owner:req.user.userId }).select("_id balance"),
Scout.findById(scoutId)
]);

if(!team){
return res.status(404).json({
message:"Team nicht gefunden"
});
}

if(!scout){
return res.status(404).json({
message:"Scout nicht gefunden"
});
}

/* ================= TEAM CHECK ================= */

if(!scout.team || scout.team.toString() !== team._id.toString()){

return res.status(403).json({
message:"Scout gehört nicht deinem Team"
});

}

/* ================= BUSY CHECK ================= */

if(scout.busyUntil && scout.busyUntil > new Date()){

return res.status(400).json({
message:"Scout ist bereits unterwegs"
});

}

/* ================= MAX SCOUTS CHECK ================= */

const scoutCount = await Scout.countDocuments({
team:team._id
});

if(scoutCount >= 5){

return res.status(400).json({
message:"Maximal 5 Scouts erlaubt"
});

}

/* ================= MISSION COST ================= */

let cost = 50000;

if(duration === 7) cost = 120000;
if(duration === 14) cost = 220000;

/* ================= MONEY CHECK ================= */

if(team.balance < cost){

return res.status(400).json({
message:"Nicht genug Geld"
});

}

/* ================= BALANCE UPDATE ================= */

team.balance -= cost;

/* ================= MISSION END ================= */

const end = new Date();
end.setDate(end.getDate() + duration);

/* ================= SCOUT UPDATE ================= */

scout.busyUntil = end;

scout.mission = {
region,
duration
};

/* ================= MISSION ERSTELLEN ================= */

await ScoutMission.create({

scout: scout._id,
region,
duration,
endsAt: end,
isResolved:false,
results:[]

});

/* ================= SAVE ================= */

await Promise.all([
team.save(),
scout.save()
]);

/* ================= RESPONSE ================= */

res.json({
success:true,
missionEnds:end
});

}catch(err){

console.error("Scout Mission Fehler:", err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
SCOUT NETWORK
GET /api/scout/network
===================================================== */

router.get("/network", auth, async (req,res)=>{

try{

const team = await Team.findOne({ owner:req.user.userId });

if(!team){
return res.status(404).json({
message:"Team nicht gefunden"
});
}

/* fertige Missionen laden */

const missions = await ScoutMission.find({
isResolved:true
}).populate("scout");

res.json(missions);

}catch(err){

console.error("Scout Network Fehler:", err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
SCOUT PLAYER SIGN
POST /api/scout/sign
===================================================== */

router.post("/sign", auth, async (req,res)=>{

try{

const { missionId, playerIndex } = req.body;

const team = await Team.findOne({ owner:req.user.userId });

if(!team){
return res.status(404).json({
message:"Team nicht gefunden"
});
}

const mission = await ScoutMission.findById(missionId);

if(!mission){
return res.status(404).json({
message:"Mission nicht gefunden"
});
}

const playerData = mission.results[playerIndex];

if(!playerData){
return res.status(404).json({
message:"Spieler nicht gefunden"
});
}

/* Spieler erstellen */

const player = await Player.create({

...playerData,
team: team._id

});

/* Spieler aus Scout Liste entfernen */

mission.results.splice(playerIndex,1);

await mission.save();

res.json(player);

}catch(err){

console.error("Scout Sign Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
SCOUT PLAYER REJECT
POST /api/scout/reject
===================================================== */

router.post("/reject", auth, async (req,res)=>{

try{

const { missionId, playerIndex } = req.body;

const mission = await ScoutMission.findById(missionId);

if(!mission){
return res.status(404).json({
message:"Mission nicht gefunden"
});
}

mission.results.splice(playerIndex,1);

await mission.save();

res.json({
success:true
});

}catch(err){

console.error("Scout Reject Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

module.exports = router;