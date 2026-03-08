const cron = require("node-cron");

const ScoutMission = require("../models/ScoutMission");
const Scout = require("../models/Scout");

const { generateScoutPlayers } =
require("../services/scoutResultGenerator");

function startScoutCron(){

cron.schedule("0 * * * *", async ()=>{

const missions = await ScoutMission.find({
isResolved:false,
endsAt:{ $lte:new Date() }
}).populate("scout");

for(const mission of missions){

const players =
generateScoutPlayers(mission.scout.stars);

mission.results=players;
mission.isResolved=true;

await mission.save();

const scout = await Scout.findById(mission.scout._id);

scout.isOnMission=false;
scout.missionEnds=null;

await scout.save();

}

});

}

module.exports={startScoutCron};