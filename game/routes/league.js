const express = require("express");
const Team = require("../models/Team");

const router = express.Router();

/* =========================
   GESAMTTABELLE
========================= */

router.get("/table", async (req, res) => {
  try {
    const teams = await Team.find({});

    const table = teams
      .map(team => ({
        name: team.name,
        games: team.gamesPlayed,
        wins: team.wins,
        draws: team.draws,
        losses: team.losses,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        diff: team.goalsFor - team.goalsAgainst,
        points: team.points,
        previousPosition: team.previousPosition
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.diff !== a.diff) return b.diff - a.diff;
        return b.goalsFor - a.goalsFor;
      });

    table.forEach((team, index) => {
      team.position = index + 1;
    });

    res.json(table);

  } catch (err) {
    res.status(500).json({ message: "Fehler Tabelle" });
  }
});

/* =========================
   HEIMTABELLE
========================= */

router.get("/home-table", async (req, res) => {
  try {
    const teams = await Team.find({});

    const table = teams
      .map(team => ({
        name: team.name,
        games: team.homeGames,
        goalsFor: team.homeGoalsFor,
        goalsAgainst: team.homeGoalsAgainst,
        points: team.homePoints
      }))
      .sort((a, b) => b.points - a.points);

    res.json(table);

  } catch (err) {
    res.status(500).json({ message: "Fehler Heimtabelle" });
  }
});

/* =========================
   AUSWÄRTSTABELLE
========================= */

router.get("/away-table", async (req, res) => {
  try {
    const teams = await Team.find({});

    const table = teams
      .map(team => ({
        name: team.name,
        games: team.awayGames,
        goalsFor: team.awayGoalsFor,
        goalsAgainst: team.awayGoalsAgainst,
        points: team.awayPoints
      }))
      .sort((a, b) => b.points - a.points);

    res.json(table);

  } catch (err) {
    res.status(500).json({ message: "Fehler Auswärtstabelle" });
  }
});

module.exports = router;