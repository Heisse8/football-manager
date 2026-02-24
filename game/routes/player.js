const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Team = require("../models/Team");
const auth = require("../middleware/auth");

// =============================
// GET ALL PLAYERS OF MY TEAM
// =============================
router.get("/my-team", auth, async (req, res) => {
  try {
    const team = await Team.findOne({ owner: req.user.userId });
    if (!team) {
      return res.status(404).json({ message: "Team nicht gefunden" });
    }

    const players = await Player.find({ team: team._id });

    res.json(players);
  } catch (err) {
    console.error("Spieler Ladefehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

module.exports = router;