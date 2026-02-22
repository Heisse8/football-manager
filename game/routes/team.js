const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const User = require("../models/User");
const Team = require("../models/Team");
const { generateSquad } = require("../utils/playerGenerator");

// ==========================
// GET eigenes Team
// ==========================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("club");

    if (!user || !user.club) {
      return res.status(404).json({ message: "Kein Team gefunden" });
    }

    res.json(user.club);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

// ==========================
// TEAM ERSTELLEN MIT LIGA-SYSTEM
// ==========================
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, shortName } = req.body;

    if (!name || !shortName) {
      return res.status(400).json({ message: "Name und Kürzel erforderlich" });
    }

    const user = await User.findById(req.user.userId);

    if (user.club) {
      return res.status(400).json({ message: "Team existiert bereits" });
    }

    // 🔥 ALLE LIGEN
    const leagues = [
      "GER_1", "GER_2",
      "ENG_1", "ENG_2",
      "ESP_1", "ESP_2",
      "FRA_1", "FRA_2",
      "ITA_1", "ITA_2"
    ];

    let assignedLeague = null;

    for (let league of leagues) {
      const count = await Team.countDocuments({ league });
      if (count < 18) {
        assignedLeague = league;
        break;
      }
    }

    if (!assignedLeague) {
      return res.status(500).json({ message: "Alle Ligen sind voll" });
    }

    const newTeam = new Team({
      name,
      shortName,
      league: assignedLeague,
      country: assignedLeague.split("_")[0],
      players: generateSquad(),
      points: 0,
      gamesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0
    });

    await newTeam.save();

    user.club = newTeam._id;
    await user.save();

    res.status(201).json({
      message: "Team erfolgreich erstellt",
      team: newTeam
    });

  } catch (err) {
    res.status(500).json({ message: "Serverfehler", error: err.message });
  }
});

module.exports = router;