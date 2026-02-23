const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const auth = require("../middleware/auth");


// ================= CREATE TEAM =================
router.post("/create", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    let { name, shortName } = req.body;

    if (!name || !shortName) {
      return res.status(400).json({ message: "Name und Kürzel erforderlich." });
    }

    name = name.trim();
    shortName = shortName.trim().toUpperCase();

    if (name.length > 21) {
      return res.status(400).json({ message: "Max 21 Zeichen." });
    }

    if (!/^[A-Z]{3}$/.test(shortName)) {
      return res.status(400).json({ message: "Kürzel = 3 Großbuchstaben." });
    }

    // Hat User schon ein Team?
    const existingUserTeam = await Team.findOne({ owner: userId });
    if (existingUserTeam) {
      return res.status(400).json({ message: "Du hast bereits ein Team." });
    }

    // Doppelte Namen verhindern
    if (await Team.findOne({ name })) {
      return res.status(400).json({ message: "Name vergeben." });
    }

    if (await Team.findOne({ shortName })) {
      return res.status(400).json({ message: "Kürzel vergeben." });
    }

    // Liga-Zuteilung
    const teamCount = await Team.countDocuments();
    const index = teamCount + 1;

    let country;
    let league;

    if (index <= 18) {
      country = "Deutschland";
      league = "GER_1";
    } else if (index <= 36) {
      country = "Deutschland";
      league = "GER_2";
    } else if (index <= 54) {
      country = "England";
      league = "ENG_1";
    } else if (index <= 72) {
      country = "England";
      league = "ENG_2";
    } else {
      country = "Deutschland";
      league = "GER_1";
    }

    const newTeam = new Team({
      name,
      shortName,
      country,
      league,
      owner: userId
    });

    await newTeam.save();

    res.status(201).json(newTeam);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverfehler" });
  }
});


// ================= GET MY TEAM =================
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const team = await Team.findOne({ owner: userId });

    if (!team) {
      return res.status(404).json({ message: "Kein Team gefunden" });
    }

    res.json(team);

  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});


module.exports = router;