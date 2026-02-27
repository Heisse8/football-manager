const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const Match = require("../models/Match");

const {
  getNextMatchdayStart,
  generateLeagueSchedule
} = require("../utils/seasonScheduler");

/* ======================================================
   START SEASON
====================================================== */

router.post("/start", async (req, res) => {
  try {

    const activeSeason = await Match.findOne({
      competition: "league",
      played: false
    });

    if (activeSeason) {
      return res.status(400).json({
        error: "Saison läuft bereits"
      });
    }

    const teams = await Team.find({ league: "bundesliga" });

    if (teams.length !== 18) {
      return res.status(400).json({
        error: "Liga nicht vollständig (18 Teams nötig)"
      });
    }

    const startDate = getNextMatchdayStart(new Date());

    await generateLeagueSchedule(teams, startDate);

    res.json({
      message: "Saison gestartet",
      firstMatchday: startDate
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Saisonstart fehlgeschlagen"
    });
  }
});

module.exports = router;