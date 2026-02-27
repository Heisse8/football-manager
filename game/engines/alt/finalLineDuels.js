function resolveFinalDuel({
  attackingTeam,
  homePlayers,
  awayPlayers,
  homeAnalysis,
  awayAnalysis
}) {

  const attackPower =
    attackingTeam === "home"
      ? homeAnalysis.chanceCreation
      : awayAnalysis.chanceCreation;

  const defensePower =
    attackingTeam === "home"
      ? awayAnalysis.restDefense
      : homeAnalysis.restDefense;

  const baseProbability =
    (attackPower * 0.02) -
    (defensePower * 0.015);

  if (Math.random() < baseProbability) {

    const xG = Math.random() * 0.4 + 0.1;

    const scored = Math.random() < xG;

    const players =
      attackingTeam === "home"
        ? homePlayers
        : awayPlayers;

    const scorer =
      players[Math.floor(Math.random() * players.length)];

    return {
      type: "chance",
      xG,
      scored,
      scorer: scorer.lastName
    };
  }

  return { type: "no_action" };
}

module.exports = {
  resolveFinalDuel
};