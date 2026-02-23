const express = require("express");
const router = express.Router();
const Team = require("../models/Team");

// POST /api/team/create
router.post("/create", async (req, res) => {
  try {
    let { name, shortName } = req.body;

    if (!name || !shortName) {
      return res.status(400).json({
        message: "Name und Kürzel sind erforderlich."
      });
    }

    // Trim & Format
    name = name.trim();
    shortName = shortName.trim().toUpperCase();

    // Validierung
    if (name.length > 21) {
      return res.status(400).json({
        message: "Teamname darf maximal 21 Zeichen haben."
      });
    }

    if (shortName.length !== 3) {
      return res.status(400).json({
        message: "Kürzel muss genau 3 Buchstaben haben."
      });
    }

    if (!/^[A-Z]{3}$/.test(shortName)) {
      return res.status(400).json({
        message: "Kürzel darf nur aus 3 Großbuchstaben bestehen."
      });
    }

    // Prüfen auf doppelte Namen
    const existingName = await Team.findOne({ name });
    if (existingName) {
      return res.status(400).json({
        message: "Dieser Teamname ist bereits vergeben."
      });
    }

    // Prüfen auf doppeltes Kürzel
    const existingShort = await Team.findOne({ shortName });
    if (existingShort) {
      return res.status(400).json({
        message: "Dieses Kürzel ist bereits vergeben."
      });
    }

    // Anzahl bestehender Teams
    const teamCount = await Team.countDocuments();
    const index = teamCount + 1;

    let country;
    let league;

    if (index <= 18) {
      country = "Deutschland";
      league = "Liga 1";
    } else if (index <= 36) {
      country = "Deutschland";
      league = "Liga 2";
    } else if (index <= 54) {
      country = "England";
      league = "Liga 1";
    } else if (index <= 72) {
      country = "England";
      league = "Liga 2";
    } else {
      country = "Deutschland";
      league = "Liga 1";
    }

    const newTeam = new Team({
      name,
      shortName,
      country,
      league
    });

    await newTeam.save();

    res.status(201).json({
      message: "Team erfolgreich erstellt.",
      team: newTeam
    });

  } catch (err) {
    console.error("Team Create Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

module.exports = router;