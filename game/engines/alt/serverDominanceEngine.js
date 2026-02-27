const { detectDefensiveLine } = require("./structureEngine");
const { calculateBuildUpShape } = require("./buildUpEngine");
const { calculateZoneOverloads } = require("./overloadEngine");
const { interpretStructure } = require("./structureInterpreter");
const { evaluatePhases } = require("./overloadEngine");
const { calculateTeamStrength } = require("./matchEnginePhase3");
const { calculateDominance } = require("./dominanceEngine");
const { roleConfig } = require("./roleConfig");

/* =====================================================
 SERVER DOMINANCE ENGINE
 1:1 kompatibel mit TeamPage Frontend
===================================================== */

function calculateDominanceFromLockedLineup(team, players) {

if (!team.lockedLineup || !players) return null;

/* =========================================
 1️⃣ DEFENSIVE SHAPE
========================================= */

const defensiveShape = detectDefensiveLine(team.lockedLineup);

/* =========================================
 2️⃣ BUILD UP SHAPE
========================================= */

const buildUpShape =
calculateBuildUpShape(team.lockedLineup, roleConfig);

/* =========================================
 3️⃣ OVERLOAD MATRIX
========================================= */

const overloadMatrix =
calculateZoneOverloads(team.lockedLineup, roleConfig);

/* =========================================
 4️⃣ STRUCTURE INTERPRETATION
========================================= */

const structure =
interpretStructure(team.lockedLineup, players);

/* =========================================
 5️⃣ PHASE EVALUATION
========================================= */

const phaseValues =
evaluatePhases(structure, team.tactics);

/* =========================================
 6️⃣ TEAM STRENGTH
========================================= */

const teamPower =
calculateTeamStrength({
lineup: team.lockedLineup,
players,
defensiveShape,
buildUpShape,
overloadMatrix,
roleProfiles: roleConfig,
playstyle: team.tactics
});

/* =========================================
 7️⃣ DOMINANCE
========================================= */

const dominance =
calculateDominance({
teamPower,
overloadMatrix,
defensiveShape,
buildUpShape,
playstyle: team.tactics
});

return {
...dominance,
overloadMatrix,
shape: defensiveShape,
mainFocusZone: detectMainFocusZone(overloadMatrix)
};
}

/* =====================================================
 HELPER: MAIN FOCUS ZONE
===================================================== */

function detectMainFocusZone(overloadMatrix) {

if (!overloadMatrix) return "central_box";

const { left, center, right } = overloadMatrix;

if (left >= center && left >= right)
return "left_halfspace_high";

if (right >= center && right >= left)
return "right_halfspace_high";

return "central_box";
}

module.exports = {
calculateDominanceFromLockedLineup
};