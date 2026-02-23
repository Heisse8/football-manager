function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function avg(players, attr) {
  return players.reduce((sum, p) => sum + (p[attr] || 50), 0) / players.length;
}

function overall(players) {
  return players.reduce((sum, p) => sum + (p.stars || 2.5), 0) / players.length;
}

// =========================================
// 🔥 ZONENBERECHNUNG
// =========================================

function calculateZones(players) {

  const defense =
    avg(players, "defending") * 0.6 +
    avg(players, "physical") * 0.4;

  const midfield =
    avg(players, "passing") * 0.6 +
    avg(players, "mentality") * 0.4;

  const attack =
    avg(players, "shooting") * 0.6 +
    avg(players, "pace") * 0.4;

  return { defense, midfield, attack };
}

// =========================================
// 🔥 BALLBESITZ
// =========================================

function calculatePossession(home, away, tactics) {

  let homeScore =
    home.midfield * 0.5 +
    home.defense * 0.2 +
    home.attack * 0.3;

  let awayScore =
    away.midfield * 0.5 +
    away.defense * 0.2 +
    away.attack * 0.3;

  // Pressing Einfluss
  if (tactics.home.pressing === "hoch") homeScore += 5;
  if (tactics.away.pressing === "hoch") awayScore += 5;

  const total = homeScore + awayScore;

  const homePoss = clamp((homeScore / total) * 100, 35, 65);

  return {
    home: Math.round(homePoss),
    away: Math.round(100 - homePoss)
  };
}

// =========================================
// 🔥 CHANCEN
// =========================================

function calculateChances(possession, zones) {

  const baseChances = 6 + Math.random() * 6;

  const home =
    baseChances *
    (possession.home / 100) *
    (zones.home.attack / zones.away.defense);

  const away =
    baseChances *
    (possession.away / 100) *
    (zones.away.attack / zones.home.defense);

  return {
    home: Math.round(clamp(home, 1, 12)),
    away: Math.round(clamp(away, 1, 12))
  };
}

// =========================================
// 🔥 TORE + xG
// =========================================

function calculateGoals(chances, zones) {

  const homeEfficiency = zones.home.attack / 100;
  const awayEfficiency = zones.away.attack / 100;

  const homeGoals = Math.round(
    chances.home * (0.15 + homeEfficiency * 0.3) * Math.random()
  );

  const awayGoals = Math.round(
    chances.away * (0.15 + awayEfficiency * 0.3) * Math.random()
  );

  return {
    homeGoals: clamp(homeGoals, 0, 6),
    awayGoals: clamp(awayGoals, 0, 6),
    xGHome: parseFloat((chances.home * 0.2).toFixed(2)),
    xGAway: parseFloat((chances.away * 0.2).toFixed(2))
  };
}

// =========================================
// 🔥 VERLETZUNGEN
// =========================================

function calculateInjuries(players) {

  const fitnessAvg = avg(players, "fitness");
  const physicalAvg = avg(players, "physical");

  const risk =
    (100 - fitnessAvg) * 0.01 +
    (70 - physicalAvg) * 0.005;

  if (Math.random() < risk) {
    return {
      injured: true,
      weeks: Math.floor(Math.random() * 6) + 1
    };
  }

  return { injured: false, weeks: 0 };
}

// =========================================
// 🔥 KARTEN
// =========================================

function calculateCards(players) {

  const mentality = avg(players, "mentality");

  const yellow =
    Math.random() < 0.8
      ? Math.floor(Math.random() * 4)
      : 0;

  const red =
    Math.random() < 0.05 + (50 - mentality) * 0.001
      ? 1
      : 0;

  return { yellow, red };
}

// =========================================
// 🔥 HAUPTFUNKTION
// =========================================

function simulateMatchAdvanced({
  homePlayers,
  awayPlayers,
  homeTactics,
  awayTactics,
  homeAdvantage = 0
}) {

  const homeZones = calculateZones(homePlayers);
  const awayZones = calculateZones(awayPlayers);

  // Heimvorteil
  homeZones.midfield += homeAdvantage * 100;
  homeZones.attack += homeAdvantage * 80;

  const possession = calculatePossession(
    homeZones,
    awayZones,
    { home: homeTactics, away: awayTactics }
  );

  const chances = calculateChances(
    possession,
    { home: homeZones, away: awayZones }
  );

  const goals = calculateGoals(
    chances,
    { home: homeZones, away: awayZones }
  );

  const injuries = {
    home: calculateInjuries(homePlayers),
    away: calculateInjuries(awayPlayers)
  };

  const cards = {
    home: calculateCards(homePlayers),
    away: calculateCards(awayPlayers)
  };

  return {
    result: {
      homeGoals: goals.homeGoals,
      awayGoals: goals.awayGoals
    },
    possession,
    chances,
    xG: {
      home: goals.xGHome,
      away: goals.xGAway
    },
    injuries,
    cards
  };
}

module.exports = { simulateMatchAdvanced };