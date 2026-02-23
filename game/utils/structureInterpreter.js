function interpretStructure(lineup, players) {

  let buildUpUnits = 0;
  let midfieldPresence = 0;
  let chanceCreation = 0;
  let restDefense = 0;
  let transitionThreat = 0;
  let counterRisk = 0;
  let centralPresence = 0;
  let wingThreat = 0;

  lineup.forEach(slot => {
    if (!slot.player) return;

    switch (slot.role) {

      case "klassischer_verteidiger":
        restDefense += 2;
        buildUpUnits += 1;
        break;

      case "ballspielender_verteidiger":
        buildUpUnits += 2;
        break;

      case "box_to_box":
        midfieldPresence += 2;
        transitionThreat += 1;
        break;

      case "inverser_fluegel":
        chanceCreation += 2;
        centralPresence += 1;
        break;

      case "winger":
        wingThreat += 2;
        break;

      case "konterstuermer":
        transitionThreat += 3;
        counterRisk += 1;
        break;

      default:
        midfieldPresence += 1;
    }
  });

  return {
    buildUpUnits,
    midfieldPresence,
    chanceCreation,
    restDefense,
    transitionThreat,
    counterRisk,
    centralPresence,
    wingThreat
  };
}

module.exports = { interpretStructure };