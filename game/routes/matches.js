const express = require("express");
const League = require("../models/League");
const Team = require("../models/Team");

const router = express.Router();

/* =========================
   AKTUELLER SPIELTAG
========================= */

router.get("/current", async (req, res) => {
  try {
    const league = await League.findOne();
    if (!league) return res.json([]);

    const currentMatchday = league.currentMatchday - 1;
    if (currentMatchday < 0) return res.json([]);

    const matches = league.schedule[currentMatchday] || [];

    const result = [];

    for (const match of matches) {
      const home = await Team.findById(match.home);
      const away = await Team.findById(match.away);

      result.push({
        _id: match._id,
        homeTeam: home?.name || "Unbekannt",
        awayTeam: away?.name || "Unbekannt",
        homeGoals: match.homeGoals ?? "-",
        awayGoals: match.awayGoals ?? "-",
        played: match.played
      });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: "Fehler Matches" });
  }
});

module.exports = router;