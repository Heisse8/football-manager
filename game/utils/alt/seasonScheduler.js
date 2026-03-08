const Match = require("../models/Match");

/* ======================================================
   ERSTER SPIELTAG (Dienstag 22:00 Lock)
====================================================== */

function getNextMatchdayStart(today) {
  const date = new Date(today);
  const day = date.getDay(); // 0=So, 1=Mo, 2=Di

  let daysUntilTuesday = (2 - day + 7) % 7;

  if (daysUntilTuesday === 0 && date.getHours() >= 22) {
    daysUntilTuesday = 7;
  }

  date.setDate(date.getDate() + daysUntilTuesday);
  date.setHours(22, 0, 0, 0);

  return date;
}

/* ======================================================
   18 TEAMS – DOUBLE ROUND ROBIN
====================================================== */

async function generateLeagueSchedule(teams, lineupLockDate) {
  if (teams.length !== 18) {
    throw new Error("Liga benötigt genau 18 Teams");
  }

  const teamIds = teams.map(t => t._id);

  // Circle Method
  const rounds = teamIds.length - 1; // 17
  const matchesPerRound = teamIds.length / 2; // 9

  let rotation = [...teamIds];

  const allRounds = [];

  for (let round = 0; round < rounds; round++) {
    const roundMatches = [];

    for (let i = 0; i < matchesPerRound; i++) {
      const home = rotation[i];
      const away = rotation[rotation.length - 1 - i];

      roundMatches.push({ home, away });
    }

    allRounds.push(roundMatches);

    // Rotation (erstes Team bleibt fix)
    const fixed = rotation[0];
    const rest = rotation.slice(1);

    rest.unshift(rest.pop());
    rotation = [fixed, ...rest];
  }

  // Rückrunde spiegeln
  const secondHalf = allRounds.map(round =>
    round.map(match => ({
      home: match.away,
      away: match.home
    }))
  );

  const fullSeason = [...allRounds, ...secondHalf]; // 34 Spieltage

  /* ======================================================
     MATCHES IN DB ERSTELLEN
  ====================================================== */

  let currentDate = new Date(lineupLockDate);

  for (let i = 0; i < fullSeason.length; i++) {
    const matchday = i + 1;

    // Spiel findet Mittwoch 04:00 statt (Cron Simulation)
    const matchDate = new Date(currentDate);
    matchDate.setDate(matchDate.getDate() + 1);
    matchDate.setHours(4, 0, 0, 0);

    for (const match of fullSeason[i]) {
      await Match.create({
        homeTeam: match.home,
        awayTeam: match.away,
        matchday,
        competition: "league",
        date: matchDate,
        status: "scheduled",
        played: false
      });
    }

    // Nächster Spieltag +7 Tage
    currentDate.setDate(currentDate.getDate() + 7);
  }
}

module.exports = {
  getNextMatchdayStart,
  generateLeagueSchedule
};