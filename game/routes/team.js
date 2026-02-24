const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const auth = require("../middleware/auth");

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

    const newTeam = new Team({
      name,
      shortName,
      owner: userId,
      country: "Deutschland",
      league: "GER_1",

      balance: 5000000,
      currentMatchday: 1,

      lineup: {},
      bench: [],

      tactics: {
        playStyle: "ballbesitz",
        tempo: "kontrolliert",
        mentality: "ausgewogen",
        pressing: "mittel",
        defensiveLine: "mittel"
      },

      lineupLocked: false,
      lockedLineup: {},
      lockedBench: [],

      // Tabellenwerte
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      tablePosition: 0
    });

    await newTeam.save();

    res.status(201).json({
      message: "Team erfolgreich erstellt.",
      team: newTeam,
    });

  } catch (err) {
    console.error("Create Team Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

/* =====================================================
 GET MY TEAM
===================================================== */
router.get("/", auth, async (req, res) => {
  try {
    const team = await Team.findOne({ owner: req.user.userId });

    if (!team) {
      return res.status(404).json({
        message: "Kein Team gefunden",
      });
    }

    res.json(team);

  } catch (err) {
    console.error("Get Team Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

/* =====================================================
 GET OTHER TEAM (Read Only)
===================================================== */
router.get("/:id", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: "Team nicht gefunden"
      });
    }

    res.json({
      name: team.name,
      shortName: team.shortName,
      league: team.league,
      lineup: team.lockedLineup,
      tactics: team.tactics,
      tablePosition: team.tablePosition
    });

  } catch (err) {
    console.error("Get Other Team Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

/* =====================================================
 UPDATE LINEUP + BENCH + TACTICS
===================================================== */
router.put("/lineup", auth, async (req, res) => {
  try {
    const { lineup, bench, tactics } = req.body;

    const team = await Team.findOne({
      owner: req.user.userId,
    });

    if (!team) {
      return res.status(404).json({
        message: "Team nicht gefunden",
      });
    }

    if (team.lineupLocked) {
      return res.status(403).json({
        message: "Lineup ist für diesen Spieltag gesperrt.",
      });
    }

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
    team.tactics = tactics;

    await team.save();

    res.json({ message: "Lineup gespeichert" });

  } catch (err) {
    console.error("Lineup Update Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

module.exports = router;