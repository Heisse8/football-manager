function analyzeTeamStructure(players, tactics) {

  const structure = {
    centerBacks: 0,
    fullbacks: 0,
    invertedFullbacks: 0,
    defensiveMids: 0,
    centralMids: 0,
    attackingMids: 0,
    wingers: 0,
    strikers: 0,

    avgPace: 0,
    avgPassing: 0,
    avgDefending: 0,
    avgShooting: 0,
    avgMentality: 0,
    avgPhysical: 0
  };

  let total = players.length;

  players.forEach(p => {

    // ================= POSITIONEN =================

    if (p.positions.includes("CB")) structure.centerBacks++;
    if (p.positions.includes("LB") || p.positions.includes("RB"))
      structure.fullbacks++;

    if (p.positions.includes("CDM")) structure.defensiveMids++;
    if (p.positions.includes("CM")) structure.centralMids++;
    if (p.positions.includes("CAM")) structure.attackingMids++;

    if (p.positions.includes("LW") || p.positions.includes("RW"))
      structure.wingers++;

    if (p.positions.includes("ST")) structure.strikers++;

    // ================= ATTRIBUTE AVERAGE =================

    structure.avgPace += p.pace || 50;
    structure.avgPassing += p.passing || 50;
    structure.avgDefending += p.defending || 50;
    structure.avgShooting += p.shooting || 50;
    structure.avgMentality += p.mentality || 50;
    structure.avgPhysical += p.physical || 50;
  });

  // Durchschnittswerte berechnen
  structure.avgPace /= total;
  structure.avgPassing /= total;
  structure.avgDefending /= total;
  structure.avgShooting /= total;
  structure.avgMentality /= total;
  structure.avgPhysical /= total;

  // ================= TAKTISCHE MODIFIKATION =================

  if (tactics.invertedFullbacks) {
    structure.invertedFullbacks = structure.fullbacks;
  }

  return structure;
}

module.exports = { analyzeTeamStructure };