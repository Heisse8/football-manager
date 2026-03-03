/* =====================================================
   HILFSFUNKTIONEN
===================================================== */

function random(min, max) {
  return min + Math.random() * (max - min);
}

function calculateTeamStrength(players) {
  if (!players || players.length === 0) return 0;

  const totalStars = players.reduce((sum, p) => {
    return sum + (p.stars || 0);
  }, 0);

  return totalStars / players.length;
}

function weightedRandomPlayer(players) {
  const weighted = players.flatMap(p => {
    const isAttacker = p.positions?.some(pos =>
      ["ST","LST","RST","LW","RW","CAM"].includes(pos)
    );

    const weight = isAttacker ? 3 : 1;
    return Array(weight).fill(p);
  });

  return weighted[Math.floor(Math.random() * weighted.length)];
}

function pickAssist(players, scorerId) {
  const possible = players.filter(p => p._id.toString() !== scorerId.toString());
  return possible[Math.floor(Math.random() * possible.length)];
}

/* =====================================================
   SPIELSTIL-MODIFIER
===================================================== */

function applyPlaystyleModifiers(stats, playstyle, rating) {

  const multiplier = 1 + (rating * 0.05);

  switch (playstyle) {

    case "Ballbesitz":
      stats.control *= 1.15 * multiplier;
      stats.attack *= 1.05 * multiplier;
      break;

    case "Kontern":
      stats.attack *= 1.15 * multiplier;
      stats.control *= 0.9;
      break;

    case "Gegenpressing":
      stats.attack *= 1.20 * multiplier;
      stats.intensity *= 1.3;
      break;

    case "Mauern":
      stats.defense *= 1.25 * multiplier;
      stats.attack *= 0.85;
      break;
  }

  return stats;
}

/* =====================================================
   MATCH SIMULATION
===================================================== */

function simulateMatch(homeTeam, awayTeam) {

  const homeStrength = calculateTeamStrength(homeTeam.players);
  const awayStrength = calculateTeamStrength(awayTeam.players);

  let home = {
    attack: homeStrength,
    defense: homeStrength,
    control: homeStrength,
    intensity: 1
  };

  let away = {
    attack: awayStrength,
    defense: awayStrength,
    control: awayStrength,
    intensity: 1
  };

  home = applyPlaystyleModifiers(home, homeTeam.manager.playstyle, homeTeam.manager.rating);
  away = applyPlaystyleModifiers(away, awayTeam.manager.playstyle, awayTeam.manager.rating);

  // Heimvorteil
  home.attack *= 1.05;
  home.control *= 1.05;

  /* ================= BALLBESITZ ================= */

  const totalControl = home.control + away.control;

  const homePossession = Math.round((home.control / totalControl) * 100);
  const awayPossession = 100 - homePossession;

  /* ================= SCHÜSSE ================= */

  const homeShots = Math.max(1, Math.round(home.attack * random(2.8, 4.2)));
  const awayShots = Math.max(1, Math.round(away.attack * random(2.8, 4.2)));

  /* ================= xG ================= */

  const homeXG = +(homeShots * random(0.09, 0.16)).toFixed(2);
  const awayXG = +(awayShots * random(0.09, 0.16)).toFixed(2);

  /* ================= TORE ================= */

  const homeGoals = Math.round(homeXG * random(0.6, 1.15));
  const awayGoals = Math.round(awayXG * random(0.6, 1.15));

  /* ================= ECKBÄLLE ================= */

  const homeCorners = Math.round(homeShots * random(0.25, 0.4));
  const awayCorners = Math.round(awayShots * random(0.25, 0.4));

  /* ================= KARTEN ================= */

  const baseCards = random(1, 4);

  const homeYellow = Math.round(baseCards * home.intensity * random(0.8, 1.3));
  const awayYellow = Math.round(baseCards * away.intensity * random(0.8, 1.3));

  const homeRed = Math.random() < 0.06 ? 1 : 0;
  const awayRed = Math.random() < 0.06 ? 1 : 0;

  /* ================= TOREVENTS ================= */

  function generateGoalEvents(goals, players) {
    const events = [];

    for (let i = 0; i < goals; i++) {

      const scorer = weightedRandomPlayer(players);
      const assist = pickAssist(players, scorer._id);

      const minute = Math.floor(random(1, 91));

      events.push({
        minute,
        scorer: {
          id: scorer._id,
          name: scorer.lastName
        },
        assist: {
          id: assist._id,
          name: assist.lastName
        }
      });
    }

    return events.sort((a, b) => a.minute - b.minute);
  }

  const homeGoalEvents = generateGoalEvents(homeGoals, homeTeam.players);
  const awayGoalEvents = generateGoalEvents(awayGoals, awayTeam.players);

  return {
    result: {
      homeGoals,
      awayGoals
    },
    stats: {
      possession: {
        home: homePossession,
        away: awayPossession
      },
      shots: {
        home: homeShots,
        away: awayShots
      },
      xG: {
        home: homeXG,
        away: awayXG
      },
      corners: {
        home: homeCorners,
        away: awayCorners
      },
      yellowCards: {
        home: homeYellow,
        away: awayYellow
      },
      redCards: {
        home: homeRed,
        away: awayRed
      }
    },
    events: {
      homeGoals: homeGoalEvents,
      awayGoals: awayGoalEvents
    }
  };
}

module.exports = {
  simulateMatch
};