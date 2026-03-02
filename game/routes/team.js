const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const Stadium = require("../models/Stadium");
const Player = require("../models/Player");
const Manager = require("../models/Manager");
const auth = require("../middleware/auth");
const { generatePlayersForTeam } = require("../utils/playerGenerator");

/* =====================================================
 FORMATIONEN
===================================================== */

const formations = {
  "4-3-3": ["GK","LB","LCB","RCB","RB","CDM","LCM","RCM","LW","ST","RW"],
  "4-4-2": ["GK","LB","LCB","RCB","RB","LCM","RCM","LW","RW","LST","RST"],
  "4-2-3-1": ["GK","LB","LCB","RCB","RB","LCDM","RCDM","LW","CAM","RW","ST"],
  "3-5-2": ["GK","LCB","CCB","RCB","LWB","RWB","CDM","LCM","RCM","LST","RST"]
};

/* =====================================================
 POSITIONS-INTELLIGENZ
===================================================== */

function positionMatches(playerPositions, slot) {
  if (playerPositions.includes(slot)) return true;

  const cleanSlot = slot.replace("L","").replace("R","");
  return playerPositions.some(pos => {
    const cleanPos = pos.replace("L","").replace("R","");
    return cleanPos === cleanSlot;
  });
}

/* =====================================================
 TRAINER-KI
===================================================== */

function generateSmartLineup(players, formation) {
  const lineup = {};
  const bench = [];
  const used = new Set();

  const slots = formations[formation] || formations["4-3-3"];

  const sortedPlayers = [...players].sort(
    (a, b) => b.stars - a.stars
  );

  for (const slot of slots) {
    const bestPlayer = sortedPlayers.find(player =>
      !used.has(player._id.toString()) &&
      positionMatches(player.positions, slot)
    );

    if (bestPlayer) {
      lineup[slot] = bestPlayer._id;
      used.add(bestPlayer._id.toString());
    }
  }

  for (const player of sortedPlayers) {
    if (!used.has(player._id.toString()) && bench.length < 7) {
      bench.push(player._id);
      used.add(player._id.toString());
    }
  }

  return { lineup, bench };
}

/* =====================================================
 CREATE TEAM
===================================================== */

router.post("/create", auth, async (req, res) => {
  try {

    const userId = req.user.userId;
    let { name, shortName } = req.body;

    if (!name || !shortName) {
      return res.status(400).json({
        message: "Name und Kürzel erforderlich."
      });
    }

    name = name.trim();
    shortName = shortName.trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(shortName)) {
      return res.status(400).json({
        message: "Kürzel muss genau 3 Großbuchstaben haben."
      });
    }

    if (await Team.findOne({ owner: userId })) {
      return res.status(400).json({
        message: "Du hast bereits ein Team."
      });
    }

    if (await Team.findOne({ name })) {
      return res.status(400).json({
        message: "Teamname bereits vergeben."
      });
    }

    if (await Team.findOne({ shortName })) {
      return res.status(400).json({
        message: "Kürzel bereits vergeben."
      });
    }

    /* ================= TEAM ================= */

    const newTeam = new Team({
      name,
      shortName,
      owner: userId,
      country: "Deutschland",
      league: "GER_1",
      balance: 5000000,
      currentMatchday: 1,
      lineupLocked: false,
      lockedLineup: {},
      lockedBench: [],
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

    /* ================= SPIELER ================= */

    await generatePlayersForTeam(newTeam);
    const players = await Player.find({ team: newTeam._id });

    /* ================= MANAGER ================= */

    const firstNames = ["Thomas", "Michael", "Stefan", "Lukas", "Daniel"];
    const lastNames = ["Schmidt", "Müller", "Wagner", "Becker", "Hoffmann"];
    const playstyles = ["Ballbesitz","Kontern","Gegenpressing","Mauern"];
    const formationKeys = Object.keys(formations);

    const randomFormation =
      formationKeys[Math.floor(Math.random() * formationKeys.length)];

    const manager = await Manager.create({
      team: newTeam._id,
      firstName: firstNames[Math.floor(Math.random()*firstNames.length)],
      lastName: lastNames[Math.floor(Math.random()*lastNames.length)],
      age: 40 + Math.floor(Math.random()*15),
      rating: 1 + Math.floor(Math.random()*4),
      formation: randomFormation,
      playstyle: playstyles[Math.floor(Math.random()*playstyles.length)]
    });

    /* ================= 🧠 STARTELF ================= */

    const { lineup, bench } = generateSmartLineup(
      players,
      manager.formation
    );

    newTeam.lockedLineup = lineup;
    newTeam.lockedBench = bench;

    await newTeam.save();

    /* ================= STADION ================= */

    await Stadium.create({
      team: newTeam._id,
      capacity: 2000,
      ticketPrice: 15
    });

    res.status(201).json({
      message: "Team erfolgreich erstellt.",
      team: newTeam
    });

  } catch (err) {
    console.error("Create Team Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});


/* =====================================================
 GET MY TEAM  ✅ WICHTIG
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
    console.error("Get Team Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});


module.exports = router;