const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const authMiddleware = require("../middleware/auth");


// ==========================================
// 🔥 TEAM ERSTELLEN
// ==========================================
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, shortName, league, country } = req.body;

    // Prüfen ob User schon ein Team hat
    const existingTeam = await Team.findOne({ owner: req.user.userId });
    if (existingTeam) {
      return res.status(400).json({ message: "Du hast bereits ein Team." });
    }

    // Prüfen ob Teamname schon existiert
    const nameExists = await Team.findOne({ name });
    if (nameExists) {
      return res.status(400).json({ message: "Teamname bereits vergeben." });
    }

    const shortExists = await Team.findOne({ shortName });
    if (shortExists) {
      return res.status(400).json({ message: "Kürzel bereits vergeben." });
    }

    const newTeam = new Team({
      name,
      shortName,
      league,
      country,
      owner: req.user.userId   // 🔥 GANZ WICHTIG
    });

    await newTeam.save();

    res.status(201).json(newTeam);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// 🔥 EIGENES TEAM ABRUFEN
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const team = await Team.findOne({ owner: req.user.userId });

    if (!team) {
      return res.status(404).json({ message: "Kein Team gefunden." });
    }

    res.json(team);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;