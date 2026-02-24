const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const auth = require("../middleware/auth");

/* ================= GET MY TEAM ================= */
router.get("/", auth, async (req, res) => {
  const team = await Team.findOne({ owner: req.user.userId });
  if (!team) return res.status(404).json({ message: "Kein Team" });
  res.json(team);
});

/* ================= GET OTHER TEAM (Read Only) ================= */
router.get("/:id", auth, async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ message: "Team nicht gefunden" });

  res.json({
    name: team.name,
    lineup: team.lockedLineup,
    tactics: team.tactics,
    league: team.league
  });
});

/* ================= UPDATE LINEUP ================= */
router.put("/lineup", auth, async (req, res) => {

  const { lineup, bench, tactics } = req.body;

  const team = await Team.findOne({ owner: req.user.userId });
  if (!team) return res.status(404).json({ message: "Team nicht gefunden" });

  if (team.lineupLocked)
    return res.status(403).json({ message: "Lineup gesperrt" });

  team.lineup = lineup;
  team.bench = bench;
  team.tactics = tactics;

  await team.save();
  res.json({ message: "Gespeichert" });
});

module.exports = router;