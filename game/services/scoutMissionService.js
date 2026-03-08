const ScoutMission = require("../models/ScoutMission");
const Scout = require("../models/Scout");
const Team = require("../models/Team");

async function startScoutMission({teamId,scoutId,region,duration}){

const scout = await Scout.findById(scoutId);

if(!scout) throw new Error("Scout nicht gefunden");

if(scout.isOnMission)
throw new Error("Scout ist bereits unterwegs");

/* Dauer berechnen */

let days=7;

if(duration===14) days=14;
if(duration===30) days=30;

const end = new Date();
end.setDate(end.getDate()+days);

scout.isOnMission=true;
scout.missionEnds=end;
scout.missionRegion=region;

await scout.save();

const mission = await ScoutMission.create({

team:teamId,
scout:scoutId,
region,
duration:days,
endsAt:end

});

return mission;

}

module.exports={startScoutMission};