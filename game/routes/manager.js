const express = require("express");
const router = express.Router();
const Manager = require("../models/Manager");
const Team = require("../models/Team");
const auth = require("../middleware/auth");

router.get("/my", auth, async (req, res) => {
  try {
    const team = await Team.findOne({
      owner: req.user.userId
    });

    if (!team) {
      return res.status(404).json({
        message: "Kein Team gefunden"
      });
    }

    const manager = await Manager.findOne({
      team: team._id
    });

    if (!manager) {
      return res.status(404).json({
        message: "Kein Manager gefunden"
      });
    }

    res.json(manager);

  } catch (err) {
    console.error("Manager Fehler:", err);
    res.status(500).json({
      message: "Serverfehler"
    });
  }
});

module.exports = router;