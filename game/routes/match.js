const express = require("express");
const router = express.Router();
const Match = require("../models/Match");

// GET MATCH BY ID
router.get("/:id", async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("homeTeam")
      .populate("awayTeam");

    if (!match) {
      return res.status(404).json({ error: "Match nicht gefunden" });
    }

    res.json(match);
  } catch (err) {
    res.status(500).json({ error: "Serverfehler" });
  }
});

module.exports = router;