function calculateMatchIntelligence({
  minute,
  teamSide, // "home" | "away"
  gameState,
  analysis,
  state
}) {

  const goalDiff =
    state.home.goals - state.away.goals;

  let riskLevel = 0;
  let pressingBoost = 0;
  let zoneShift = null;

  /* ==========================
     1️⃣ SPIELSTAND REAKTION
  =========================== */

  if (teamSide === "home") {

    if (goalDiff < 0 && minute > 60) {
      riskLevel += 0.15;
      pressingBoost += 0.1;
    }

    if (goalDiff > 0 && minute > 75) {
      riskLevel -= 0.1;
    }

  } else {

    if (goalDiff > 0 && minute > 60) {
      riskLevel += 0.15;
      pressingBoost += 0.1;
    }

    if (goalDiff < 0 && minute > 75) {
      riskLevel -= 0.1;
    }
  }

  /* ==========================
     2️⃣ SPIELPHASEN
  =========================== */

  if (minute > 80) {
    riskLevel += 0.05;
  }

  if (minute < 20) {
    pressingBoost += 0.05;
  }

  /* ==========================
     3️⃣ ZONEN-SHIFT BEI RÜCKSTAND
  =========================== */

  if (riskLevel > 0.1) {

    if (analysis.mainFocusZone === "left_halfspace_high") {
      zoneShift = "central_box";
    }

    if (analysis.mainFocusZone === "right_halfspace_high") {
      zoneShift = "central_box";
    }
  }

  return {
    riskLevel,
    pressingBoost,
    zoneShift
  };
}

module.exports = { calculateMatchIntelligence };