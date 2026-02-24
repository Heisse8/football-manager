const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const Stadium = require("../models/Stadium");
const auth = require("../middleware/auth");
const { generatePlayersForTeam } = require("../utils/playerGenerator");

/* =====================================================
   CREATE TEAM
===================================================== */
router.post("/create", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    let { name, shortName } = req.body;

    if (!name || !shortName) {
      return res.status(400).json({
        message: "Name und Kürzel erforderlich.",
      });
    }

    name = name.trim();
    shortName = shortName.trim().toUpperCase();

    if (name.length > 21) {
      return res.status(400).json({
        message: "Teamname max. 21 Zeichen.",
      });
    }

    if (!/^[A-Z]{3}$/.test(shortName)) {
      return res.status(400).json({
        message: "Kürzel muss genau 3 Großbuchstaben haben.",
      });
    }

    if (await Team.findOne({ owner: userId })) {
      return res.status(400).json({
        message: "Du hast bereits ein Team.",
      });
    }

    if (await Team.findOne({ name })) {
      return res.status(400).json({
        message: "Teamname bereits vergeben.",
      });
    }

    if (await Team.findOne({ shortName })) {
      return res.status(400).json({
        message: "Kürzel bereits vergeben.",
      });
    }

    /* ========= Liga Zuteilung ========= */
    const teamCount = await Team.countDocuments();
    const index = teamCount + 1;

    let country = "Deutschland";
    let league = "GER_1";

    if (index <= 18) league = "GER_1";
    else if (index <= 36) league = "GER_2";
    else if (index <= 54) {
      country = "England";
      league = "ENG_1";
    } else if (index <= 72) {
      country = "England";
      league = "ENG_2";
    }

    /* ========= Team erstellen ========= */
    const newTeam = new Team({
      name,
      shortName,
      country,
      league,
      owner: userId,
      balance: 5000000,
      currentMatchday: 1,
      lineup: {},
      bench: [],
      formation: "4-4-2",
      lineupLocked: false,
      lockedLineup: {},
      lockedBench: [],
    });

    await newTeam.save();

    try {
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

      await generatePlayersForTeam(newTeam);

    } catch (setupError) {
      console.error("Setup Fehler:", setupError);

      await Stadium.deleteOne({ team: newTeam._id });
      await Team.findByIdAndDelete(newTeam._id);

      return res.status(500).json({
        message: "Fehler beim Setup des Teams.",
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

/* =====================================================
   GET MY TEAM
===================================================== */
router.get("/", auth, async (req, res) => {
  try {
    const team = await Team.findOne({
      owner: req.user.userId,
    });

    if (!team) {
      return res.status(404).json({
        message: "Kein Team gefunden",
      });
    }

    res.json(team);

  } catch (err) {
    console.error("Team Get Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

/* =====================================================
   UPDATE LINEUP + BENCH + FORMATION
===================================================== */
router.put("/lineup", auth, async (req, res) => {
  try {
    const { lineup, bench, formation } = req.body;

    const team = await Team.findOne({
      owner: req.user.userId,
    });

    if (!team) {
      return res.status(404).json({
        message: "Team nicht gefunden",
      });
    }

    // 🔒 WICHTIG: Lock prüfen
    if (team.lineupLocked) {
      return res.status(403).json({
        message: "Lineup ist für diesen Spieltag gesperrt.",
      });
    }

    // Validierung
    if (typeof lineup !== "object") {
      return res.status(400).json({
        message: "Ungültiges Lineup-Format",
      });
    }

    if (!Array.isArray(bench)) {
      return res.status(400).json({
        message: "Ungültiges Bench-Format",
      });
    }

    team.lineup = lineup;
    team.bench = bench;
    team.formation = formation || team.formation;

    await team.save();

    res.json({ message: "Lineup gespeichert" });

  } catch (err) {
    console.error("Lineup Update Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

module.exports = router;