const express = require("express");
const Team = require("../models/Team");
const League = require("../models/League");

const router = express.Router();

/* =========================
   LEAGUE INITIALISIEREN
========================= */

router.get("/init-league", async (req, res) => {
  try {

    const existingLeague = await League.findOne();
    if (existingLeague) {
      return res.json({ message: "League existiert bereits" });
    }

    const teams = await Team.find({});
    if (teams.length < 2) {
      return res.json({ message: "Nicht genug Teams vorhanden" });
    }

    const schedule = [];

    // einfache Hinrunde (Round Robin)
    for (let i = 0; i < teams.length - 1; i++) {
      const matchday = [];

      for (let j = 0; j < teams.length / 2; j++) {
        const home = teams[j];
        const away = teams[teams.length - 1 - j];

        matchday.push({
          home: home._id,
          away: away._id,
          homeGoals: null,
          awayGoals: null,
          played: false
        });
      }

      teams.splice(1, 0, teams.pop());
      schedule.push(matchday);
    }

    const league = new League({
      currentMatchday: 1,
      schedule: schedule
    });

    await league.save();

    res.json({ message: "League erfolgreich erstellt" });

  } catch (err) {
    res.status(500).json({ message: "Fehler bei League Erstellung" });
  }
});

module.exports = router;