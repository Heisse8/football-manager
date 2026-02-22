const express = require("express");
const router = express.Router();
const Team = require("../models/Team");

router.get("/:league", async (req, res) => {
  try {
    const teams = await Team.find({ league: req.params.league })
      .sort({ points: -1, goalsFor: -1 });

    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

module.exports = router;