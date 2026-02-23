function calculateStandardChances(structure, possession, chances) {

  // Ecken entstehen eher bei:
  // - viel Ballbesitz
  // - viel Flügelspiel
  // - vielen Chancen

  const cornerBase =
    (possession / 100) * 4 +
    structure.wingThreat * 0.5 +
    chances * 0.2;

  const freeKickBase =
    structure.chanceCreation * 0.3 +
    chances * 0.15;

  return {
    corners: Math.round(cornerBase),
    freeKicks: Math.round(freeKickBase)
  };
}


// Kopfballstärke berechnen
function calculateHeaderStrength(players) {

  const avgPhysical =
    players.reduce((sum, p) => sum + (p.physical || 50), 0) /
    players.length;

  return avgPhysical;
}


// Standard-xG berechnen
function calculateStandardXG({
  attackingPlayers,
  defendingStructure,
  standardChances
}) {

  const headerStrength = calculateHeaderStrength(attackingPlayers);

  const defensiveResistance = defendingStructure.restDefense;

  const cornerXG =
    (standardChances.corners * 0.08) *
    (headerStrength / 70) *
    (1 - defensiveResistance * 0.03);

  const freeKickXG =
    (standardChances.freeKicks * 0.05) *
    (headerStrength / 75);

  return cornerXG + freeKickXG;
}

module.exports = {
  calculateStandardChances,
  calculateStandardXG
};