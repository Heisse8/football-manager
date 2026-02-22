function calculateTeamStrength(team) {

  const starters = team.players.filter(p => p.isStarting);

  if (starters.length === 0) {
    return 50; // Notfallwert
  }

  const totalRating = starters.reduce((sum, p) => sum + p.rating, 0);
  return totalRating / starters.length;
}

function simulateMatch(teamA, teamB) {

  const strengthA = calculateTeamStrength(teamA);
  const strengthB = calculateTeamStrength(teamB);

  const baseGoalsA = Math.random() * (strengthA / 20);
  const baseGoalsB = Math.random() * (strengthB / 20);

  const homeGoals = Math.floor(baseGoalsA);
  const awayGoals = Math.floor(baseGoalsB);

  return {
    homeGoals,
    awayGoals
  };
}

module.exports = { simulateMatch };