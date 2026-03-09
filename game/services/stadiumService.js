const Team = require("../models/Team");

/* =====================================================
STADION UPGRADE LEVELS
===================================================== */

const stadiumLevels = {

1:{
capacity:12000,
ticketPrice:18,
upgradeCost:0,
buildDays:0
},

2:{
capacity:20000,
ticketPrice:20,
upgradeCost:5000000,
buildDays:7
},

3:{
capacity:30000,
ticketPrice:22,
upgradeCost:15000000,
buildDays:14
},

4:{
capacity:45000,
ticketPrice:25,
upgradeCost:35000000,
buildDays:21
},

5:{
capacity:60000,
ticketPrice:28,
upgradeCost:70000000,
buildDays:30
}

};

/* =====================================================
STADIUM UPGRADE
===================================================== */

async function upgradeStadium(teamId){

const team = await Team.findById(teamId);

if(!team){
throw new Error("Team nicht gefunden");
}

/* Bauphase check */

if(team.stadiumConstructionEnd){
throw new Error("Stadion wird bereits ausgebaut");
}

const nextLevel = team.stadiumLevel + 1;

if(!stadiumLevels[nextLevel]){
throw new Error("Max Stadionlevel erreicht");
}

const upgrade = stadiumLevels[nextLevel];

if(team.balance < upgrade.upgradeCost){
throw new Error("Zu wenig Geld");
}

/* Geld abziehen */

team.balance -= upgrade.upgradeCost;

/* Bauzeit berechnen */

const endDate = new Date();
endDate.setDate(endDate.getDate() + upgrade.buildDays);

team.stadiumConstructionEnd = endDate;

/* Level vormerken */

team.stadiumNextLevel = nextLevel;

await team.save();

return {

message:"Stadionausbau gestartet",
newLevel:nextLevel,
fertigAm:endDate

};

}

/* =====================================================
STADIUM BUILD COMPLETE
(wird täglich von Cron geprüft)
===================================================== */

async function finishStadiumUpgrades(){

const now = new Date();

const teams = await Team.find({
stadiumConstructionEnd:{ $lte: now }
});

for(const team of teams){

const level = team.stadiumNextLevel;

if(!stadiumLevels[level]) continue;

const data = stadiumLevels[level];

team.stadiumLevel = level;
team.stadiumCapacity = data.capacity;
team.ticketPrice = data.ticketPrice;

team.stadiumConstructionEnd = null;
team.stadiumNextLevel = null;

await team.save();

console.log(
`Stadion Upgrade fertig: ${team.name} Level ${level}`
);

}

}

/* =====================================================
EXPORT
===================================================== */

module.exports = {

upgradeStadium,
finishStadiumUpgrades

};