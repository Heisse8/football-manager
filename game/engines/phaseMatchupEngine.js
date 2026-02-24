function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function calculateMatchup(homePhases, awayPhases) {

  // =========================
  // 1️⃣ BALLBESITZ
  // =========================

  const homePossessionScore =
    homePhases.ownPossessionStrength -
    awayPhases.defensiveStructureStrength;

  const awayPossessionScore =
    awayPhases.ownPossessionStrength -
    homePhases.defensiveStructureStrength;

  let total = homePossessionScore + awayPossessionScore;

  if (total <= 0) total = 1;

  let homePossession =
    50 + (homePossessionScore - awayPossessionScore) * 2;

  homePossession = clamp(homePossession, 30, 70);
  const awayPossession = 100 - homePossession;

  // =========================
  // 2️⃣ CHANCEN AUS POSITIONSANGRIFF
  // =========================

  const homeSetPlayChances =
    (homePhases.ownPossessionStrength * homePossession) / 100;

  const awaySetPlayChances =
    (awayPhases.ownPossessionStrength * awayPossession) / 100;

  // =========================
  // 3️⃣ CHANCEN AUS UMSCHALTEN
  // =========================

  const homeTransitionChances =
    homePhases.offensiveTransitionStrength -
    awayPhases.defensiveTransitionStrength;

  const awayTransitionChances =
    awayPhases.offensiveTransitionStrength -
    homePhases.defensiveTransitionStrength;

  // =========================
  // 4️⃣ GESAMTCHANCEN
  // =========================

  const homeTotalChances =
    clamp(homeSetPlayChances / 5 + homeTransitionChances, 1, 15);

  const awayTotalChances =
    clamp(awaySetPlayChances / 5 + awayTransitionChances, 1, 15);

  // =========================
  // 5️⃣ SPIELTYP ERMITTELN
  // =========================

  let matchType = "ausgeglichen";

  if (homePossession > 60) matchType = "Heimteam dominiert";
  if (awayPossession > 60) matchType = "Auswärtsteam dominiert";

  if (
    Math.abs(homeTransitionChances) > 4 ||
    Math.abs(awayTransitionChances) > 4
  ) {
    matchType = "Konterspiel";
  }

  return {
    possession: {
      home: Math.round(homePossession),
      away: Math.round(awayPossession)
    },
    chances: {
      home: Math.round(homeTotalChances),
      away: Math.round(awayTotalChances)
    },
    matchType
  };
}

module.exports = { calculateMatchup };