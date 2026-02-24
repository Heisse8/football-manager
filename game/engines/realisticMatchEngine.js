const { interpretStructure } = require("./structureInterpreter");
const { evaluatePhases } = require("./phaseEvaluator");
const { calculateMatchup } = require("./phaseMatchupEngine");
const { evaluateFinalLineDuels } = require("./finalLineDuels");
const {
  calculateStandardChances,
  calculateStandardXG
} = require("../utils/standardEngine");
const { simulate90Minutes } = require("./minuteMatchEngine");

// ================= VARIANZ =================
function applyVariance(value) {
  const variance = value * 0.05;
  return value + (Math.random() * variance * 2 - variance);
}

// ================= TORE AUS xG =================
function goalsFromXG(xG) {
  if (xG < 0.5) return 0;
  if (xG < 1.2) return 1;
  if (xG < 2.2) return 2;
  if (xG < 3.2) return 3;
  return Math.round(xG / 1.2);
}

// ================= MATCH ENGINE =================
function simulateRealisticMatch({
  homePlayers,
  awayPlayers,
  homeTeam,
  awayTeam,
  stadium,
  fillRate
}) {

  const homeLineup = homeTeam.lockedLineup || homeTeam.lineup;
  const awayLineup = awayTeam.lockedLineup || awayTeam.lineup;

  // 1️⃣ Struktur (Koordinatenanalyse)
  const homeStructure = interpretStructure(homeLineup, homePlayers);
  const awayStructure = interpretStructure(awayLineup, awayPlayers);

  // 2️⃣ Phasen
  const homePhases = evaluatePhases(homeStructure, homeTeam.tactics);
  const awayPhases = evaluatePhases(awayStructure, awayTeam.tactics);

  // 3️⃣ Matchup
  const matchup = calculateMatchup(homePhases, awayPhases);

  // 4️⃣ Halbraum-Bonus
  matchup.chances.home += homeStructure.halfspacePresence * 0.03;
  matchup.chances.away += awayStructure.halfspacePresence * 0.03;

  // 5️⃣ Breitenlogik
  if (homeStructure.widthScore > 2)
    matchup.chances.home *= 1.05;

  if (awayStructure.widthScore > 2)
    matchup.chances.away *= 1.05;

  // 6️⃣ Positions-xG Basis
  let homePositionalXG = matchup.chances.home * 0.11;
  let awayPositionalXG = matchup.chances.away * 0.11;

  // 🔥 6b️⃣ FINAL LINE DUELS
  const homeDuelImpact = evaluateFinalLineDuels(
    homeStructure,
    awayStructure,
    homePlayers,
    awayPlayers
  );

  const awayDuelImpact = evaluateFinalLineDuels(
    awayStructure,
    homeStructure,
    awayPlayers,
    homePlayers
  );

  homePositionalXG *= 1 + homeDuelImpact * 0.06;
  awayPositionalXG *= 1 + awayDuelImpact * 0.06;

  // 7️⃣ Konter-xG
  const homeCounterXG =
    Math.max(
      0,
      homePhases.offensiveTransitionStrength -
      awayPhases.defensiveTransitionStrength
    ) * 0.08;

  const awayCounterXG =
    Math.max(
      0,
      awayPhases.offensiveTransitionStrength -
      homePhases.defensiveTransitionStrength
    ) * 0.08;

  // 8️⃣ Standards
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

  // 9️⃣ Heimvorteil
  const stadiumFactor =
    (stadium.capacity / 50000) * fillRate;

  const homeAdvantage =
    1 + stadiumFactor * 0.15;

  // 🔟 Gesamt-xG
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

  const homeGoals = goalsFromXG(homeXG);
  const awayGoals = goalsFromXG(awayXG);

  // 1️⃣1️⃣ 90 Minuten Simulation
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

  return {
    result: { homeGoals, awayGoals },
    possession: matchup.possession,
    chances: matchup.chances,
    xG: {
      home: parseFloat(homeXG.toFixed(2)),
      away: parseFloat(awayXG.toFixed(2))
    },
    duelImpact: {
      home: parseFloat(homeDuelImpact.toFixed(2)),
      away: parseFloat(awayDuelImpact.toFixed(2))
    },
    systemPreview: {
      home: homeStructure.zones,
      away: awayStructure.zones
    },
    events,
    matchType: matchup.matchType
  };
}

module.exports = { simulateRealisticMatch };