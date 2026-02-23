const { interpretStructure } = require("./structureInterpreter");
const { evaluatePhases } = require("./phaseEvaluator");
const { calculateMatchup } = require("./phaseMatchupEngine");

// kleine Varianz ±5%
function applyVariance(value) {
  const variance = value * 0.05;
  return value + (Math.random() * variance * 2 - variance);
}

// Tore aus xG (logisch, nicht würfeln)
function goalsFromXG(xG) {
  if (xG < 0.5) return 0;
  if (xG < 1.2) return 1;
  if (xG < 2.2) return 2;
  if (xG < 3.2) return 3;
  return Math.round(xG / 1.2);
}

function simulateRealisticMatch({
  homePlayers,
  awayPlayers,
  homeTeam,
  awayTeam,
  stadium,
  fillRate
}) {

  // =========================
  // 1️⃣ STRUCTURE INTERPRETER
  // =========================

  const homeStructure = interpretStructure(
    homeTeam.lineup,
    homePlayers
  );

  const awayStructure = interpretStructure(
    awayTeam.lineup,
    awayPlayers
  );

  // =========================
  // 2️⃣ PHASEN BEWERTUNG
  // =========================

  const homePhases = evaluatePhases(
    homeStructure,
    homeTeam.tactics
  );

  const awayPhases = evaluatePhases(
    awayStructure,
    awayTeam.tactics
  );

  // =========================
  // 3️⃣ MATCHUP
  // =========================

  const matchup = calculateMatchup(homePhases, awayPhases);

  // =========================
  // 4️⃣ HEIMVORTEIL (Stadion)
  // =========================

  const stadiumFactor =
    (stadium.capacity / 50000) * fillRate;

  const homeAdvantage =
    1 + stadiumFactor * 0.15; // max ca +15%

  // =========================
  // 5️⃣ xG BERECHNUNG
  // =========================

  let homeXG =
    matchup.chances.home * 0.12 * homeAdvantage;

  let awayXG =
    matchup.chances.away * 0.12;

  homeXG = applyVariance(homeXG);
  awayXG = applyVariance(awayXG);

  // =========================
  // 6️⃣ TORE
  // =========================

  const homeGoals = goalsFromXG(homeXG);
  const awayGoals = goalsFromXG(awayXG);

  return {
    result: {
      homeGoals,
      awayGoals
    },
    possession: matchup.possession,
    chances: matchup.chances,
    xG: {
      home: parseFloat(homeXG.toFixed(2)),
      away: parseFloat(awayXG.toFixed(2))
    },
    matchType: matchup.matchType
  };
}

module.exports = { simulateRealisticMatch };