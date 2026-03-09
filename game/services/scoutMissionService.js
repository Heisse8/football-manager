const ScoutMission = require("../models/ScoutMission");
const Scout = require("../models/Scout");
const Team = require("../models/Team");

async function startScoutMission({ teamId, scoutId, region, duration }){

/* =====================================================
TEAM PRÜFEN
===================================================== */

const team = await Team.findById(teamId);

if(!team){
throw new Error("Team nicht gefunden");
}

/* =====================================================
SCOUT PRÜFEN
===================================================== */

const scout = await Scout.findById(scoutId);

if(!scout){
throw new Error("Scout nicht gefunden");
}

if(scout.isOnMission){
throw new Error("Scout ist bereits unterwegs");
}

/* =====================================================
DAUER VALIDIEREN
===================================================== */

const allowedDurations = [7,14,30];

let days = 7;

if(allowedDurations.includes(duration)){
days = duration;
}

/* =====================================================
MISSION ENDE
===================================================== */

const end = new Date();
end.setDate(end.getDate() + days);

/* =====================================================
SCOUT STATUS
===================================================== */

scout.isOnMission = true;
scout.missionEnds = end;
scout.missionRegion = region;

await scout.save();

/* =====================================================
MISSION ERSTELLEN
===================================================== */

const mission = await ScoutMission.create({

team: teamId,
scout: scoutId,

region,

duration: days,

endsAt: end,

isResolved: false

});

return mission;

}

module.exports = { startScoutMission };