function calculateDominance({ teamPower, overloadMatrix, defensiveShape }) {

  const possession =
    teamPower.control * 0.6 +
    overloadMatrix.center * 0.3;

  const chanceCreation =
    teamPower.attack * 0.5 +
    (overloadMatrix.left + overloadMatrix.right) * 0.25;

  const pressing =
    teamPower.defense * 0.4 +
    teamPower.control * 0.2;

  const restDefense =
    defensiveShape === "BACK_3" ? 85 :
    defensiveShape === "BACK_4" ? 75 :
    70;

  return {
    possession: Math.round(possession),
    chanceCreation: Math.round(chanceCreation),
    pressing: Math.round(pressing),
    restDefense
  };
}

module.exports = { calculateDominance };