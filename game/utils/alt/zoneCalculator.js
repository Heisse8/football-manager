function calculateZones(players) {

  let buildup = 0;
  let midfield = 0;
  let wings = 0;
  let finalThird = 0;
  let restDefense = 0;

  players.forEach(p => {

    // Aufbau (Torwart + IV + 6er)
    if (p.positions.includes("GK") || 
        p.positions.includes("CB") || 
        p.positions.includes("CDM")) {
      buildup += (p.passing + p.mentality) / 2;
    }

    // Mittelfeld
    if (p.positions.includes("CM") || 
        p.positions.includes("CAM")) {
      midfield += (p.passing + p.mentality) / 2;
    }

    // Flügel
    if (p.positions.includes("RW") || 
        p.positions.includes("LW") ||
        p.positions.includes("RM") ||
        p.positions.includes("LM")) {
      wings += (p.pace + p.dribbling || p.pace) / 2;
    }

    // Strafraum
    if (p.positions.includes("ST")) {
      finalThird += (p.shooting + p.physical) / 2;
    }

    // Restverteidigung
    if (p.positions.includes("CB") || 
        p.positions.includes("CDM")) {
      restDefense += (p.defending + p.physical) / 2;
    }

  });

  return {
    buildup,
    midfield,
    wings,
    finalThird,
    restDefense
  };
}

module.exports = { calculateZones };