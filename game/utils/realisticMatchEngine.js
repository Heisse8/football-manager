const { interpretStructure } = require("./structureInterpreter");
const { evaluatePhases } = require("./phaseEvaluator");
const { calculateMatchup } = require("./phaseMatchupEngine");
const {
  calculateStandardChances,
  calculateStandardXG
} = require("./standardEngine");
const { simulate90Minutes } = require("./minuteMatchEngine");

// =========================
// VARIANZ
// =========================

function applyVariance(value) {
  const variance = value * 0.05;
  return value + (Math.random() * variance * 2 - variance);
}

// =========================
// TORE AUS xG
// =========================

function goalsFromXG(xG) {
  if (xG < 0.5) return 0;
  if (xG < 1.2) return 1;
  if (xG < 2.2) return 2;
  if (xG < 3.2) return 3;
  return Math.round(xG / 1.2);
}

// =========================
// HAUPT MATCH ENGINE
// =========================

function simulateRealisticMatch({
  homePlayers,
  awayPlayers,
  homeTeam,
  awayTeam,
  stadium,
  fillRate
}) {

  // 🔒 Locked Lineup verwenden falls vorhanden
  const homeLineup = homeTeam.lockedLineup || homeTeam.lineup;
  const awayLineup = awayTeam.lockedLineup || awayTeam.lineup;

  // =========================
  // 1️⃣ STRUKTUR
  // =========================

  const homeStructure = interpretStructure(homeLineup, homePlayers);
  const awayStructure = interpretStructure(awayLineup, awayPlayers);

  // =========================
  // 2️⃣ PHASEN
  // =========================

  const homePhases = evaluatePhases(homeStructure, homeTeam.tactics);
  const awayPhases = evaluatePhases(awayStructure, awayTeam.tactics);

  // =========================
  // 3️⃣ MATCHUP
  // =========================

  const matchup = calculateMatchup(homePhases, awayPhases);

  // =========================
  // 🔥 TEMPO EINFLUSS
  // =========================

  let homeTempo = 1;
  if (homeTeam.tactics.tempo === "hoch") homeTempo = 1.1;
  if (homeTeam.tactics.tempo === "sehr_hoch") homeTempo = 1.2;
  if (homeTeam.tactics.tempo === "langsam") homeTempo = 0.9;

  let awayTempo = 1;
  if (awayTeam.tactics.tempo === "hoch") awayTempo = 1.1;
  if (awayTeam.tactics.tempo === "sehr_hoch") awayTempo = 1.2;
  if (awayTeam.tactics.tempo === "langsam") awayTempo = 0.9;

  matchup.chances.home *= homeTempo;
  matchup.chances.away *= awayTempo;

  // =========================
  // 4️⃣ POSITIONS-xG
  // =========================

  let homePositionalXG = matchup.chances.home * 0.10;
  let awayPositionalXG = matchup.chances.away * 0.10;

  // =========================
  // 5️⃣ KONTER-xG
  // =========================

  const homeCounterPotential =
    homePhases.offensiveTransitionStrength -
    awayPhases.defensiveTransitionStrength;

  const awayCounterPotential =
    awayPhases.offensiveTransitionStrength -
    homePhases.defensiveTransitionStrength;

  let homeCounterXG =
    Math.max(0, homeCounterPotential) * 0.08;

  let awayCounterXG =
    Math.max(0, awayCounterPotential) * 0.08;

  // =========================
  // 🔥 MENTALITÄT
  // =========================

  if (homeTeam.tactics.mentality === "offensiv")
    homeCounterXG *= 1.2;

  if (homeTeam.tactics.mentality === "sehr_offensiv")
    homeCounterXG *= 1.4;

  if (awayTeam.tactics.mentality === "offensiv")
    awayCounterXG *= 1.2;

  if (awayTeam.tactics.mentality === "sehr_offensiv")
    awayCounterXG *= 1.4;

  // =========================
  // 🔥 GEGENPRESSING
  // =========================

  if (homeTeam.tactics.transitionAfterLoss === "gegenpressing")
    awayCounterXG *= 0.7;

  if (awayTeam.tactics.transitionAfterLoss === "gegenpressing")
    homeCounterXG *= 0.7;

  // =========================
  // 6️⃣ STANDARDS
  // =========================

  const homeStandards = calculateStandardChances(
    homeStructure,
    matchup.possession.home,
    matchup.chances.home
  );

  const awayStandards = calculateStandardChances(
    awayStructure,
    matchup.possession.away,
    matchup.chances.away
  );

  const homeStandardXG = calculateStandardXG({
    attackingPlayers: homePlayers,
    defendingStructure: awayStructure,
    standardChances: homeStandards
  });

  const awayStandardXG = calculateStandardXG({
    attackingPlayers: awayPlayers,
    defendingStructure: homeStructure,
    standardChances: awayStandards
  });

  // =========================
  // 7️⃣ HEIMVORTEIL
  // =========================

  const stadiumFactor =
    (stadium.capacity / 50000) * fillRate;

  const homeAdvantage =
    1 + stadiumFactor * 0.15;

  // =========================
  // 8️⃣ GESAMT-xG
  // =========================

  let homeXG =
    (homePositionalXG +
      homeCounterXG +
      homeStandardXG) *
    homeAdvantage;

  let awayXG =
    awayPositionalXG +
    awayCounterXG +
    awayStandardXG;

  homeXG = applyVariance(homeXG);
  awayXG = applyVariance(awayXG);

  // =========================
  // 9️⃣ TORE
  // =========================

  const homeGoals = goalsFromXG(homeXG);
  const awayGoals = goalsFromXG(awayXG);

  // =========================
  // 🔟 90 MINUTEN EVENTS
  // =========================

  const events = simulate90Minutes({
    homePlayers,
    awayPlayers,
    breakdown: {
      home: {
        positional: homePositionalXG,
        counter: homeCounterXG,
        standard: homeStandardXG
      },
      away: {
        positional: awayPositionalXG,
        counter: awayCounterXG,
        standard: awayStandardXG
      }
    },
    totalGoalsHome: homeGoals,
    totalGoalsAway: awayGoals
  });

  // =========================
  // RETURN
  // =========================

  return {
    result: { homeGoals, awayGoals },
    possession: matchup.possession,
    chances: matchup.chances,
    xG: {
      home: parseFloat(homeXG.toFixed(2)),
      away: parseFloat(awayXG.toFixed(2))
    },
    breakdown: {
      home: {
        positional: parseFloat(homePositionalXG.toFixed(2)),
        counter: parseFloat(homeCounterXG.toFixed(2)),
        standard: parseFloat(homeStandardXG.toFixed(2))
      },
      away: {
        positional: parseFloat(awayPositionalXG.toFixed(2)),
        counter: parseFloat(awayCounterXG.toFixed(2)),
        standard: parseFloat(awayStandardXG.toFixed(2))
      }
    },
    events,
    matchType: matchup.matchType
  };
}

module.exports = { simulateRealisticMatch };