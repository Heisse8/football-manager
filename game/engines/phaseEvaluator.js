function evaluatePhases(structure, tactics) {

  let ownPossessionStrength = 0;
  let defensiveStructureStrength = 0;
  let offensiveTransitionStrength = 0;
  let defensiveTransitionStrength = 0;

  // =========================
  // 1️⃣ EIGENER BALLBESITZ
  // =========================

  ownPossessionStrength += structure.buildUpUnits * 2;
  ownPossessionStrength += structure.midfieldPresence * 1.5;
  ownPossessionStrength += structure.chanceCreation;

  if (tactics.pressing === "hoch") {
    ownPossessionStrength += 1;
  }

  // =========================
  // 2️⃣ GEGNERISCHER BALLBESITZ
  // =========================

  defensiveStructureStrength += structure.restDefense * 2;
  defensiveStructureStrength += structure.midfieldPresence;

  if (tactics.defensiveLine === "tief") {
    defensiveStructureStrength += 2;
  }

  if (tactics.pressing === "hoch") {
    defensiveStructureStrength += 1;
  }

  // =========================
  // 3️⃣ EIGENER BALLGEWINN
  // =========================

  offensiveTransitionStrength += structure.transitionThreat * 2;

  if (tactics.pressing === "hoch") {
    offensiveTransitionStrength += 2;
  }

  if (tactics.attackFocus === "center") {
    offensiveTransitionStrength += structure.centralPresence;
  }

  if (tactics.attackFocus === "wings") {
    offensiveTransitionStrength += structure.wingThreat;
  }

  // =========================
  // 4️⃣ GEGNERISCHER BALLGEWINN
  // =========================

  defensiveTransitionStrength += structure.restDefense * 2;
  defensiveTransitionStrength -= structure.counterRisk;

  if (tactics.defensiveLine === "hoch") {
    defensiveTransitionStrength -= 2;
  }

  return {
    ownPossessionStrength,
    defensiveStructureStrength,
    offensiveTransitionStrength,
    defensiveTransitionStrength
  };
}

module.exports = { evaluatePhases };