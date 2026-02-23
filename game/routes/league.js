const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const Season = require("../models/Season");
const generateSchedule = require("../utils/generateSchedule");

// POST /api/league/:league/generate
router.post("/:league/generate", async (req, res) => {
  try {
    const { league } = req.params;

    const teams = await Team.find({ league });

    if (teams.length !== 18) {
      return res.status(400).json({
        message: "Liga muss genau 18 Teams haben."
      });
    }

    const existingSeason = await Season.findOne({ league });

    if (existingSeason && existingSeason.isGenerated) {
      return res.status(400).json({
        message: "Spielplan bereits generiert."
      });
    }

    const seasonStart = new Date(); // Startdatum = jetzt (Dienstag setzen falls nötig)

    await generateSchedule(teams, league, seasonStart);

    if (!existingSeason) {
      await Season.create({
        league,
        seasonStart,
        isGenerated: true
      });
    } else {
      existingSeason.isGenerated = true;
      await existingSeason.save();
    }

    res.json({ message: "Spielplan erfolgreich generiert." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

module.exports = router;