const Player = require("../models/Player");

async function assignPlayersToTeam(team){

const distribution = [
{ stars: 3, count: 3 },
{ stars: 2.5, count: 4 },
{ stars: 2, count: 7 },
{ stars: 1.5, count: 4 }
];

const positions = {

GK:2,
DEF:6,
MID:6,
ATT:4

};

let selectedPlayers = [];

/* Sterne Verteilung */

for(const group of distribution){

const players = await Player.aggregate([
{
$match:{
team:null,
stars:group.stars
}
},
{ $sample:{ size:group.count } }
]);

selectedPlayers = selectedPlayers.concat(players);

}

/* Position Filter */

function categorize(player){

if(player.positions.includes("GK")) return "GK";

if(
player.positions.includes("CB") ||
player.positions.includes("LB") ||
player.positions.includes("RB") ||
player.positions.includes("LWB") ||
player.positions.includes("RWB")
) return "DEF";

if(
player.positions.includes("CDM") ||
player.positions.includes("CM") ||
player.positions.includes("CAM")
) return "MID";

return "ATT";

}

const finalPlayers = [];
const positionCount = { GK:0, DEF:0, MID:0, ATT:0 };

for(const player of selectedPlayers){

const category = categorize(player);

if(positionCount[category] < positions[category]){

finalPlayers.push(player);
positionCount[category]++;

}

}

/* Falls noch Plätze fehlen */

if(finalPlayers.length < 18){

const missing = 18 - finalPlayers.length;

const extraPlayers = await Player.aggregate([
{ $match:{ team:null } },
{ $sample:{ size:missing } }
]);

finalPlayers.push(...extraPlayers);

}

/* Team zuweisen */

for(const player of finalPlayers){

await Player.findByIdAndUpdate(
player._id,
{
team:team._id,
isListed:false
}
);

}

/* übrige Spieler auf Transfermarkt */

await Player.updateMany(
{ team:null },
{
isListed:true,
transferType:"instant"
}
);

return finalPlayers;

}

module.exports = { assignPlayersToTeam };