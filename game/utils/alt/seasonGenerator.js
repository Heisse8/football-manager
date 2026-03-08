const Match = require("../models/Match");

/*
  18 Teams
  34 Spieltage
  Jeder gegen jeden (Hin- & Rückrunde)
*/

async function generateSeason({ leagueId, seasonNumber, teams }) {

  if (teams.length !== 18) {
    throw new Error("Liga braucht exakt 18 Teams.");
  }

  const teamIds = teams.map(t => t._id);

  // Round Robin Algorithmus (Circle Method)
  const rounds = [];
  const totalRounds = teamIds.length - 1; // 17
  const half = teamIds.length / 2;

  let rotation = [...teamIds];

  for (let round = 0; round < totalRounds; round++) {

    const pairings = [];

    for (let i = 0; i < half; i++) {
      const home = rotation[i];
      const away = rotation[rotation.length - 1 - i];

      pairings.push({
        homeTeam: round % 2 === 0 ? home : away,
        awayTeam: round % 2 === 0 ? away : home
      });
    }

    rounds.push(pairings);

    // Rotation (erstes Team bleibt fix)
    const fixed = rotation[0];
    const rest = rotation.slice(1);
    rest.unshift(rest.pop());
    rotation = [fixed, ...rest];
  }

  // Rückrunde (Heim/Auswärts tauschen)
  const secondHalf = rounds.map(round =>
    round.map(match => ({
      homeTeam: match.awayTeam,
      awayTeam: match.homeTeam
    }))
  );

  const fullSeason = [...rounds, ...secondHalf];

  // Matches in DB speichern
  let matchday = 1;

  for (const round of fullSeason) {

    for (const match of round) {
      await Match.create({
        league: leagueId,
        season: seasonNumber,
        matchday,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        status: "scheduled",
        played: false
      });
    }

    matchday++;
  }

  console.log("✅ Saison erfolgreich generiert");
}

module.exports = { generateSeason };