const Player = require("../../models/Player");

async function generateLineupForTeam(team) {

  const players = await Player.find({ team: team._id });

  const formationMap = {
    "4-3-3": ["GK","LB","LCB","RCB","RB","CDM","LCM","RCM","LW","ST","RW"],
    "4-4-2": ["GK","LB","LCB","RCB","RB","LCM","RCM","LM","RM","ST","ST"],
    "4-2-3-1": ["GK","LB","LCB","RCB","RB","CDM","CDM","LW","CAM","RW","ST"],
    "3-5-2": ["GK","LCB","CB","RCB","LM","RM","CDM","CM","CAM","ST","ST"]
  };

  const formation = team.managerFormation;

  const slots = formationMap[formation];

  const lineup = {};
  const bench = [];

  slots.forEach(slot => {
    const player = players.find(p =>
      p.positions.includes(slot)
    );

    if (player) {
      lineup[slot] = player._id;
    }
  });

  // Rest auf Bank
  players.forEach(p => {
    if (!Object.values(lineup).includes(p._id)) {
      bench.push(p._id);
    }
  });

  team.lineup = lineup;
  team.bench = bench.slice(0,7);

  await team.save();
}

module.exports = { generateLineupForTeam };