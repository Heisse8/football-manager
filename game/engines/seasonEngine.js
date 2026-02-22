const { simulateMatch } = require("./matchEngine");
const { applyWeeklyLoad } = require("./fitnessEngine");
const { drawAndPlayCupRound } = require("./cupEngine");

function generateTeam(name) {
  return {
    name,
    formation: "4-3-3",
    style: "possession",
    lineHeight: "medium",
    pressing: "medium",
    players: Array.from({ length: 11 }).map(() => ({
      rating: 65 + Math.random() * 15,
      role: "BoxToBox",
      fitness: 1,
      injured: false,
      injuryWeeks: 0
    })),
    points: 0
  };
}

function simulateSeason() {

  const newsFeed = [];
  const league = [];

  for (let i = 1; i <= 18; i++) {
    league.push(generateTeam("Team " + i));
  }

  let cupTeams = [...league];
  const cupWeeks = [2, 6, 10, 14]; // Pokal-Donnerstage
  const cupRoundNames = [
    "1. Runde",
    "Achtelfinale",
    "Viertelfinale",
    "Halbfinale"
  ];

  let cupRoundIndex = 0;

  for (let week = 1; week <= 17; week++) {

    // DIENSTAG – Liga
    for (let i = 0; i < league.length; i += 2) {
      const r = simulateMatch(league[i], league[i + 1]);
      if (r.homeGoals > r.awayGoals) league[i].points += 3;
      else if (r.homeGoals < r.awayGoals) league[i + 1].points += 3;
      else {
        league[i].points++;
        league[i + 1].points++;
      }
    }

    let playedCup = false;

    // DONNERSTAG – Pokal
    if (cupWeeks.includes(week) && cupTeams.length > 1) {

      cupTeams = drawAndPlayCupRound(
        cupTeams,
        cupRoundNames[cupRoundIndex],
        newsFeed
      );

      cupRoundIndex++;
      playedCup = true;
    }

    // SAMSTAG – Liga
    for (let i = 0; i < league.length; i += 2) {
      const r = simulateMatch(league[i + 1], league[i]);
      if (r.homeGoals > r.awayGoals) league[i + 1].points += 3;
      else if (r.homeGoals < r.awayGoals) league[i].points += 3;
      else {
        league[i].points++;
        league[i + 1].points++;
      }
    }

    // Belastung anwenden
    league.forEach(team => {
      applyWeeklyLoad(team, playedCup ? 3 : 2);
    });
  }

  // FINALE nach letztem Spieltag
  if (cupTeams.length === 2) {
    cupTeams = drawAndPlayCupRound(
      cupTeams,
      "Finale",
      newsFeed,
      true
    );
  }

  league.sort((a, b) => b.points - a.points);

  return {
    table: league.map((t, i) => ({
      position: i + 1,
      name: t.name,
      points: t.points
    })),
    cupWinner: cupTeams[0]?.name,
    newsFeed
  };
}

module.exports = { simulateSeason };