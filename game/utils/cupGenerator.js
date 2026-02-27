const Match = require("../models/Match");

async function generateCup({ leagueId, seasonNumber, teams }) {

  if (teams.length < 16) {
    throw new Error("Mindestens 16 Teams erforderlich.");
  }

  // Nur erste 16 Teams nehmen
  const cupTeams = teams.slice(0, 16);

  // Shuffle
  const shuffled = [...cupTeams].sort(() => Math.random() - 0.5);

  const rounds = [
    { name: "Achtelfinale", size: 16 },
    { name: "Viertelfinale", size: 8 },
    { name: "Halbfinale", size: 4 },
    { name: "Finale", size: 2 }
  ];

  let currentTeams = shuffled;

  for (let r = 0; r < rounds.length; r++) {

    const roundName = rounds[r].name;
    const nextRoundTeams = [];

    for (let i = 0; i < currentTeams.length; i += 2) {

      const home = currentTeams[i]._id;
      const away = currentTeams[i + 1]._id;

      await Match.create({
        league: leagueId,
        season: seasonNumber,
        competition: "cup",
        cupRound: roundName,
        homeTeam: home,
        awayTeam: away,
        status: "scheduled",
        played: false
      });

      // Gewinner wird später nach Berechnung gesetzt
      nextRoundTeams.push(null);
    }

    currentTeams = nextRoundTeams;
  }

  console.log("🏆 Pokal erfolgreich generiert");
}

module.exports = { generateCup };