function evaluatePhases(structure, tactics) {

  let ownPossessionStrength = 0;
  let defensiveStructureStrength = 0;
  let offensiveTransitionStrength = 0;
  let defensiveTransitionStrength = 0;

  /* =========================================
     1️⃣ BALLBESITZ – KONTROLLINDEX
  ========================================= */

  const controlCore =
    structure.zones.buildUpLine * 2.4 +
    structure.zones.midfieldLine * 2.0 +
    structure.centralPresence * 1.5 +
    structure.halfspacePresence * 1.8;

  const widthStretch =
    structure.wingPresence * 0.9;

  ownPossessionStrength = controlCore + widthStretch;

  if (tactics?.style === "ballbesitz")
    ownPossessionStrength *= 1.18;

  if (tactics?.tempo === "hoch")
    ownPossessionStrength *= 0.94;

  if (tactics?.passing === "kurz")
    ownPossessionStrength += 2.5;


  /* =========================================
     2️⃣ DEFENSIVE STABILITÄT
  ========================================= */

  const compactness =
    100 - structure.verticalCompactness;

  defensiveStructureStrength =
    structure.restDefenseUnits * 2.6 +
    structure.zones.midfieldLine * 1.4 +
    compactness * 0.06;

  if (tactics?.defensiveLine === "tief")
    defensiveStructureStrength *= 1.12;

  if (tactics?.pressing === "hoch")
    defensiveStructureStrength += 1.8;


  /* =========================================
     3️⃣ OFFENSIVE TRANSITION – EXPLOSIVITÄT
  ========================================= */

  const asymmetry =
    Math.abs(
      structure.sideDistribution.left -
      structure.sideDistribution.right
    );

  offensiveTransitionStrength =
    structure.finalLineOccupation * 2.6 +
    structure.wingPresence * 1.4 +
    asymmetry * 0.8;

  if (tactics?.style === "konter")
    offensiveTransitionStrength *= 1.3;

  if (tactics?.pressing === "hoch")
    offensiveTransitionStrength += 2.2;


  /* =========================================
     4️⃣ DEFENSIVE TRANSITION – KONTERABSICHERUNG
  ========================================= */

  defensiveTransitionStrength =
    structure.restDefenseUnits * 2.4 -
    structure.finalLineOccupation * 1.5;

  defensiveTransitionStrength -=
    (structure.wingPresence -
     structure.restDefenseUnits) * 0.9;

  if (tactics?.defensiveLine === "hoch")
    defensiveTransitionStrength -= 2.2;

  if (tactics?.style === "ballbesitz")
    defensiveTransitionStrength += 1.5;


  /* =========================================
     5️⃣ SYSTEM DOMINANCE INDEX
  ========================================= */

  const dominanceIndex =
    ownPossessionStrength * 0.35 +
    offensiveTransitionStrength * 0.25 +
    defensiveStructureStrength * 0.25 +
    defensiveTransitionStrength * 0.15;

  return {
    ownPossessionStrength,
    defensiveStructureStrength,
    offensiveTransitionStrength,
    defensiveTransitionStrength,
    dominanceIndex
  };
}

module.exports = { evaluatePhases };