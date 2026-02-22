const express = require("express");
const router = express.Router();

const Team = require("../models/Team");


// =======================================
// 🔹 Liga Tabelle abrufen
// =======================================
router.get("/:leagueId", async (req, res) => {
  try {
    const { leagueId } = req.params;

    const teams = await Team.find({ league: leagueId });

    // Sortierung: Punkte → Tordifferenz → Alphabet
    const sorted = teams.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      const diffA = (a.goalsFor || 0) - (a.goalsAgainst || 0);
      const diffB = (b.goalsFor || 0) - (b.goalsAgainst || 0);

      if (diffB !== diffA) {
        return diffB - diffA;
      }

      return a.name.localeCompare(b.name);
    });

    res.json(sorted);

  } catch (err) {
    res.status(500).json({
      message: "Fehler beim Laden der Liga",
      error: err.message
    });
  }
});


// =======================================
// 🔹 Saison beenden + Auf/Abstieg
// =======================================
router.post("/end-season", async (req, res) => {
  try {
    const countries = ["GER", "ENG", "ESP", "FRA", "ITA"];

    for (let country of countries) {

      const league1 = `${country}_1`;
      const league2 = `${country}_2`;

      const league1Teams = await Team.find({ league: league1 });
      const league2Teams = await Team.find({ league: league2 });

      // Sortierung
      const sortTable = (teams) => {
        return teams.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }

          const diffA = a.goalsFor - a.goalsAgainst;
          const diffB = b.goalsFor - b.goalsAgainst;

          if (diffB !== diffA) {
            return diffB - diffA;
          }

          return a.name.localeCompare(b.name);
        });
      };

      const sorted1 = sortTable(league1Teams);
      const sorted2 = sortTable(league2Teams);

      // 🔻 Letzte 3 aus Liga 1
      const relegated = sorted1.slice(-3);

      // 🔺 Erste 3 aus Liga 2
      const promoted = sorted2.slice(0, 3);

      // Liga wechseln
      for (let team of relegated) {
        team.league = league2;
        await team.save();
      }

      for (let team of promoted) {
        team.league = league1;
        await team.save();
      }

      // 🔄 Saison zurücksetzen (optional aber sinnvoll)
      const resetTeams = [...sorted1, ...sorted2];

      for (let team of resetTeams) {
        team.points = 0;
        team.gamesPlayed = 0;
        team.wins = 0;
        team.draws = 0;
        team.losses = 0;
        team.goalsFor = 0;
        team.goalsAgainst = 0;

        await team.save();
      }
    }

    res.json({
      message: "✅ Saison beendet – Auf- und Abstieg durchgeführt"
    });

  } catch (err) {
    res.status(500).json({
      message: "Fehler bei Saisonende",
      error: err.message
    });
  }
});


module.exports = router;