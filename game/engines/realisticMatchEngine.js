const { interpretStructure } = require("./structureInterpreter");
const { evaluatePhases } = require("./phaseEvaluator");
const { calculateMatchup } = require("./phaseMatchupEngine");
const { evaluateFinalLineDuels } = require("./finalLineDuels");
const { simulate90Minutes } = require("./minuteMatchEngine");
const { generateMatchReport } = require("./matchReport");

/* ===============================================
   VARIANZ
=============================================== */

function applyVariance(value) {
  const variance = value * 0.06;
  return value + (Math.random() * variance * 2 - variance);
}

function goalsFromXG(xG) {
  if (xG < 0.4) return 0;
  if (xG < 1.2) return 1;
  if (xG < 2.1) return 2;
  if (xG < 3.0) return 3;
  return Math.round(xG / 1.15);
}

/* ===============================================
   MAIN ENGINE
=============================================== */

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

  /* =========================
     1️⃣ STRUKTUR
  ========================= */

  const homeStructure = interpretStructure(homeLineup, homePlayers);
  const awayStructure = interpretStructure(awayLineup, awayPlayers);

  /* =========================
     2️⃣ PHASEN
  ========================= */

  const homePhases = evaluatePhases(homeStructure, homeTeam.tactics);
  const awayPhases = evaluatePhases(awayStructure, awayTeam.tactics);

  /* =========================
     3️⃣ MATCHUP
  ========================= */

  const matchup = calculateMatchup(homePhases, awayPhases);

  /* =========================
     4️⃣ POSITIONS-xG
  ========================= */

  let homePosXG = matchup.chances.home * 0.11;
  let awayPosXG = matchup.chances.away * 0.11;

  /* =========================
     5️⃣ FINAL LINE DUELS
  ========================= */

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

  homePosXG *= 1 + homeDuelImpact * 0.07;
  awayPosXG *= 1 + awayDuelImpact * 0.07;

  /* =========================
     6️⃣ TRANSITION xG
  ========================= */

  const homeCounterXG =
    Math.max(
      0,
      homePhases.offensiveTransitionStrength -
      awayPhases.defensiveTransitionStrength
    ) * 0.09;

  const awayCounterXG =
    Math.max(
      0,
      awayPhases.offensiveTransitionStrength -
      homePhases.defensiveTransitionStrength
    ) * 0.09;

  /* =========================
     7️⃣ STANDARDS
  ========================= */

  const homeStandardXG =
    homeStructure.finalLineOccupation * 0.05;

  const awayStandardXG =
    awayStructure.finalLineOccupation * 0.05;

  /* =========================
     8️⃣ HEIMVORTEIL
  ========================= */

  const stadiumFactor =
    (stadium.capacity / 50000) * fillRate;

  const homeAdvantage =
    1 + stadiumFactor * 0.18;

  /* =========================
     9️⃣ GESAMT xG
  ========================= */

  let homeXG =
    (homePosXG + homeCounterXG + homeStandardXG) *
    homeAdvantage;

  let awayXG =
    awayPosXG + awayCounterXG + awayStandardXG;

  homeXG = applyVariance(homeXG);
  awayXG = applyVariance(awayXG);

  const homeGoals = goalsFromXG(homeXG);
  const awayGoals = goalsFromXG(awayXG);

  /* =========================
     🔟 MINUTE ENGINE
  ========================= */

  const events = simulate90Minutes({
    homePlayers,
    awayPlayers,
    totalGoalsHome: homeGoals,
    totalGoalsAway: awayGoals
  });

  /* =========================
     1️⃣1️⃣ SPIELBERICHT
  ========================= */

  const report = generateMatchReport({
    homeTeam,
    awayTeam,
    result: { homeGoals, awayGoals },
    xG: { home: homeXG, away: awayXG },
    possession: matchup.possession,
    events,
    matchType: matchup.matchType
  });

  return {
    result: { homeGoals, awayGoals },
    xG: {
      home: parseFloat(homeXG.toFixed(2)),
      away: parseFloat(awayXG.toFixed(2))
    },
    possession: matchup.possession,
    duelImpact: {
      home: parseFloat(homeDuelImpact.toFixed(2)),
      away: parseFloat(awayDuelImpact.toFixed(2))
    },
    events,
    report,
    matchType: matchup.matchType
  };
}

module.exports = { simulateRealisticMatch };