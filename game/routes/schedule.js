const express = require("express");
const router = express.Router();
const { generateLeagueSchedule, generateCup } = require("../utils/scheduleGenerator");

router.post("/start-season", async (req, res) => {
  try {
    const leagues = [
      "GER_1","GER_2",
      "ENG_1","ENG_2",
      "ESP_1","ESP_2",
      "FRA_1","FRA_2",
      "ITA_1","ITA_2"
    ];

    for (let league of leagues) {
      await generateLeagueSchedule(league);
    }

    const countries = ["GER","ENG","ESP","FRA","ITA"];

    for (let country of countries) {
      await generateCup(country);
    }

    res.json({ message: "Spielplan erfolgreich erstellt" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;