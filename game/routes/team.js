const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const Stadium = require("../models/Stadium");
const auth = require("../middleware/auth");
const { generatePlayersForTeam } = require("../utils/playerGenerator");

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
      return res.status(400).json({ message: "Teamname max. 21 Zeichen." });
    }

    if (!/^[A-Z]{3}$/.test(shortName)) {
      return res.status(400).json({ message: "Kürzel muss genau 3 Großbuchstaben haben." });
    }

    // 🔒 User darf nur 1 Team haben
    if (await Team.findOne({ owner: userId })) {
      return res.status(400).json({ message: "Du hast bereits ein Team." });
    }

    if (await Team.findOne({ name })) {
      return res.status(400).json({ message: "Teamname bereits vergeben." });
    }

    if (await Team.findOne({ shortName })) {
      return res.status(400).json({ message: "Kürzel bereits vergeben." });
    }

    // ================= LIGA ZUTEILUNG =================
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

    // ================= TEAM ERSTELLEN =================
    const newTeam = new Team({
      name,
      shortName,
      country,
      league,
      owner: userId,
      balance: 5000000,
      currentMatchday: 1,
    });

    await newTeam.save();

    try {
      // Stadion
      await Stadium.create({
        team: newTeam._id,
        capacity: 2000,
        ticketPrice: 15,
        construction: {
          inProgress: false,
          targetCapacity: null,
          startMatchday: null,
          finishMatchday: null,
        },
      });

      // 18 Spieler generieren
      await generatePlayersForTeam(newTeam);

    } catch (setupError) {
      console.error("Setup Fehler:", setupError);

      await Stadium.deleteOne({ team: newTeam._id });
      await Team.findByIdAndDelete(newTeam._id);

      return res.status(500).json({
        message: "Fehler beim Setup des Teams. Bitte erneut versuchen.",
      });
    }

    res.status(201).json({
      message: "Team erfolgreich erstellt.",
      team: newTeam,
    });

  } catch (err) {
    console.error("Team Create Fehler:", err);
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
    console.error("Team Get Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

// ================= UPDATE LINEUP =================
router.put("/lineup", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { lineup } = req.body;

    if (!Array.isArray(lineup)) {
      return res.status(400).json({ message: "Ungültiges Lineup-Format" });
    }

    const team = await Team.findOne({ owner: userId });
    if (!team) {
      return res.status(404).json({ message: "Team nicht gefunden" });
    }

    team.lineup = lineup;
    await team.save();

    res.json({ message: "Lineup gespeichert" });

  } catch (err) {
    console.error("Lineup Update Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

module.exports = router;