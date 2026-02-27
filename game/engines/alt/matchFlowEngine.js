function calculateMatchFlow({ minute, state }) {

  const goalDiff = state.homeGoals - state.awayGoals;

  if (minute > 75) {
    return "endgame";
  }

  if (Math.abs(goalDiff) >= 2) {
    return "controlled";
  }

  if (Math.abs(state.momentum) > 0.5) {
    return "pressure";
  }

  return "neutral";
}

module.exports = { calculateMatchFlow };