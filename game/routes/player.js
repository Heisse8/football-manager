const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Team = require("../models/Team");
const auth = require("../middleware/auth");

// GET /api/player/my-team
router.get("/my-team", auth, async (req, res) => {
  try {
    const team = await Team.findOne({ owner: req.user.userId });
    if (!team) return res.status(404).json({ message: "Kein Team" });

    const players = await Player.find({ team: team._id });

    res.json(players);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

// PUT Startelf setzen
router.put("/set-lineup", auth, async (req, res) => {
  try {
    const { startingIds, benchIds } = req.body;

    const team = await Team.findOne({ owner: req.user.userId });
    if (!team) return res.status(404).json({ message: "Kein Team" });

    // Reset
    await Player.updateMany(
      { team: team._id },
      { startingXI: false, bench: false }
    );

    // Startelf setzen
    await Player.updateMany(
      { _id: { $in: startingIds } },
      { startingXI: true }
    );

    // Bank setzen
    await Player.updateMany(
      { _id: { $in: benchIds } },
      { bench: true }
    );

    res.json({ message: "Aufstellung gespeichert" });

  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

module.exports = router;