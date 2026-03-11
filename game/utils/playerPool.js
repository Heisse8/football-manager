const Player = require("../models/Player");

const squadStructure = [
{ positions:["GK"], count:2 },

{ positions:["CB","LB","RB","LWB","RWB"], count:6 },

{ positions:["CDM","CM","CAM"], count:6 },

{ positions:["LW","RW","ST"], count:4 }
];

const starDistribution = [
{ stars:3, count:3 },
{ stars:2.5, count:4 },
{ stars:2, count:7 },
{ stars:1.5, count:4 }
];

async function assignPlayersToTeam(team){

let selectedPlayers = [];

/* STAR DISTRIBUTION */

for(const group of starDistribution){

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

/* POSITION CHECK */

let finalPlayers = [];

for(const role of squadStructure){

const candidates = selectedPlayers.filter(p =>
p.positions.some(pos => role.positions.includes(pos))
);

const picked = candidates.slice(0,role.count);

finalPlayers = finalPlayers.concat(picked);

}

/* FALLBACK falls Positionen fehlen */

while(finalPlayers.length < 18){

const extra = selectedPlayers.find(p =>
!finalPlayers.includes(p)
);

if(extra) finalPlayers.push(extra);

}

/* SPIELER ZUWEISEN */

for(const player of finalPlayers){

await Player.findByIdAndUpdate(
player._id,
{ team:team._id }
);

}

return finalPlayers;

}

module.exports = { assignPlayersToTeam };