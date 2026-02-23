function calculateTeamStats(match) {

  const stats = {
    possession: match.possession,
    shots: match.shots,
    shotsOnTarget: match.shotsOnTarget,
    xG: match.xG,
    fouls: {
      home: Math.floor(Math.random() * 15),
      away: Math.floor(Math.random() * 15)
    },
    corners: {
      home: Math.floor(Math.random() * 10),
      away: Math.floor(Math.random() * 10)
    }
  };

  return stats;
}

module.exports = { calculateTeamStats };