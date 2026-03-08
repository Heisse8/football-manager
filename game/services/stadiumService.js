const Team = require("../models/Team");

/* =====================================================
STADION UPGRADE LEVELS
===================================================== */

const stadiumLevels = {

1:{
capacity:12000,
upgradeCost:0
},

2:{
capacity:20000,
upgradeCost:5000000
},

3:{
capacity:30000,
upgradeCost:15000000
},

4:{
capacity:45000,
upgradeCost:35000000
},

5:{
capacity:60000,
upgradeCost:70000000
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

/* Stadion upgraden */

team.stadiumLevel = nextLevel;
team.stadiumCapacity = upgrade.capacity;

await team.save();

return {
newLevel:nextLevel,
capacity:upgrade.capacity
};

}

module.exports = { upgradeStadium };