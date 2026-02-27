const { detectDefensiveLine } = require("./structureEngine");
const { calculateBuildUpShape } = require("./buildUpEngine");
const { calculateZoneOverloads } = require("./overloadEngine");
const { interpretStructure } = require("./structureInterpreter");
const { detectSystem } = require("./systemDetector");
const { calculateTeamStrength } = require("./matchEnginePhase3");
const { calculateDominance } = require("./dominanceEngine");

function buildMatchAnalysis({
  team,
  players
}) {

  const lineup = team.lockedLineup;
  const tactics = team.tactics || {};

  if (!lineup || !players || players.length < 11) {
    return null;
  }

  /* ===============================
     1️⃣ DEFENSIVE SHAPE
  =============================== */

  const defensiveShape = detectDefensiveLine(lineup);

  /* ===============================
     2️⃣ BUILD UP SHAPE
  =============================== */

  const buildUpShape = calculateBuildUpShape(
    lineup,
    team.roleProfiles || {}
  );

  /* ===============================
     3️⃣ OVERLOAD MATRIX
  =============================== */

  const overloadMatrix =
    calculateZoneOverloads(buildUpShape);

  /* ===============================
     4️⃣ STRUCTURE INTERPRETATION
  =============================== */

  const structure = interpretStructure(
    lineup,
    players
  );

  /* ===============================
     5️⃣ SYSTEM DETECTION
  =============================== */

  const system = detectSystem(structure, lineup);

  /* ===============================
     6️⃣ TEAM STRENGTH
  =============================== */

  const teamPower = calculateTeamStrength({
    lineup,
    players,
    defensiveShape,
    buildUpShape,
    overloadMatrix,
    roleProfiles: team.roleProfiles || {},
    playstyle: tactics
  });

  /* ===============================
     7️⃣ DOMINANCE
  =============================== */

  const dominance = calculateDominance({
    teamPower,
    overloadMatrix,
    defensiveShape,
    buildUpShape,
    playstyle: tactics
  });

  /* ===============================
     8️⃣ MAIN FOCUS ZONE (KEY!)
  =============================== */

  let mainFocusZone = "central_box";

  const maxOverload = Math.max(
    overloadMatrix.left || 0,
    overloadMatrix.center || 0,
    overloadMatrix.right || 0
  );

  if ((overloadMatrix.left || 0) === maxOverload)
    mainFocusZone = "left_halfspace_high";

  if ((overloadMatrix.right || 0) === maxOverload)
    mainFocusZone = "right_halfspace_high";

  if ((overloadMatrix.center || 0) === maxOverload)
    mainFocusZone = "central_box";

  /* ===============================
     RETURN FINAL ANALYSIS OBJECT
  =============================== */

  return {
    defensiveShape,
    buildUpShape,
    overloadMatrix,
    structure,
    system,
    teamPower,
    ...dominance,
    mainFocusZone
  };
}

module.exports = { buildMatchAnalysis };