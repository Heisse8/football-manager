const express = require("express");
const router = express.Router();

const Match = require("../models/Match");
const Team = require("../models/Team");
const Player = require("../models/Player");

const authMiddleware = require("../middleware/auth");

const { simulateMatchAdvanced } = require("../utils/matchEngine");

// ============================================
// 📅 MONATSANSICHT
// ============================================

router.get("/my-month", authMiddleware, async (req, res) => {
  try {

    const userTeam = await Team.findOne({ owner: req.user.userId });

    if (!userTeam) {
      return res.status(404).json({ message: "Kein Team gefunden" });
    }

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const matches = await Match.find({
      date: { $gte: start, $lte: end },
      $or: [
        { homeTeam: userTeam._id },
        { awayTeam: userTeam._id }
      ]
    })
      .populate("homeTeam awayTeam")
      .sort({ date: 1 });

    res.json(matches);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================
// ⚽ MATCH SIMULATION
// ============================================

router.post("/simulate/:matchId", authMiddleware, async (req, res) => {
  try {

    const match = await Match.findById(req.params.matchId)
      .populate("homeTeam awayTeam");

    if (!match) {
      return res.status(404).json({ message: "Match nicht gefunden" });
    }

    if (match.played) {
      return res.status(400).json({ message: "Match wurde bereits gespielt" });
    }

    // 🔹 Starting XI laden
    const homePlayers = await Player.find({
      team: match.homeTeam._id,
      startingXI: true
    });

    const awayPlayers = await Player.find({
      team: match.awayTeam._id,
      startingXI: true
    });

    if (homePlayers.length < 11 || awayPlayers.length < 11) {
      return res.status(400).json({
        message: "Beide Teams benötigen 11 Spieler in der Startelf."
      });
    }

    // 🔹 Taktiken (später dynamisch aus Team speichern)
    const homeTactics = {
      pressing: "hoch",
      block: "mittel"
    };

    const awayTactics = {
      pressing: "mittel",
      block: "Low block"
    };

    // 🔥 MATCH ENGINE
    const result = simulateMatchAdvanced({
      homePlayers,
      awayPlayers,
      homeTactics,
      awayTactics
    });

    // 🔹 Ergebnis speichern
    match.homeGoals = result.result.homeGoals;
    match.awayGoals = result.result.awayGoals;
    match.played = true;
    match.possession = result.possession;
    match.chances = result.chances;

    await match.save();

    // ======================================
    // 📊 TABELLE UPDATE (Basic Version)
    // ======================================

    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;

    homeTeam.goalsFor += result.result.homeGoals;
    homeTeam.goalsAgainst += result.result.awayGoals;

    awayTeam.goalsFor += result.result.awayGoals;
    awayTeam.goalsAgainst += result.result.homeGoals;

    if (result.result.homeGoals > result.result.awayGoals) {
      homeTeam.points += 3;
      homeTeam.wins += 1;
      awayTeam.losses += 1;
    } else if (result.result.homeGoals < result.result.awayGoals) {
      awayTeam.points += 3;
      awayTeam.wins += 1;
      homeTeam.losses += 1;
    } else {
      homeTeam.points += 1;
      awayTeam.points += 1;
      homeTeam.draws += 1;
      awayTeam.draws += 1;
    }

    await homeTeam.save();
    await awayTeam.save();

    res.json({
      message: "Match simuliert",
      result
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;