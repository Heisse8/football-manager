function calculateRestDefenseDecision({
  defensiveShift,
  ccbPlayer,
  attackerPosition,
  minute,
  gameState
}) {

  const decision = {
    action: "hold", // hold | step_out | aggressive_press
    isolationModifier: 0,
    counterRisk: 0
  };

  if (!defensiveShift.centerExposed) {
    return decision;
  }

  /* =====================================================
     1️⃣ SPIELINTELLIGENZ & POSITIONING
  ====================================================== */

  const intelligence =
    (ccbPlayer.attributes.positioning * 0.5) +
    (ccbPlayer.attributes.defending * 0.3) +
    (ccbPlayer.attributes.decisions || 50) * 0.2;

  /* =====================================================
     2️⃣ SPIELSITUATION EINFLUSS
  ====================================================== */

  const lateGame = minute > 75;
  const leading = gameState.goalDifference > 0;

  /* =====================================================
     3️⃣ ENTSCHEIDUNGSMODELL
  ====================================================== */

  const randomFactor = Math.random();

  if (intelligence > 75 && randomFactor > 0.4) {
    decision.action = "hold";
    decision.isolationModifier = -0.1;
  }

  else if (!leading && !lateGame && intelligence < 70) {
    decision.action = "step_out";
    decision.isolationModifier = 0.2;
  }

  else {
    decision.action = "aggressive_press";
    decision.isolationModifier = 0.35;
    decision.counterRisk = 0.25;
  }

  return decision;
}

module.exports = { calculateRestDefenseDecision };