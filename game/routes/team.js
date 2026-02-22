const express = require("express");
const Team = require("../models/Team");
const formations = require("../utils/formations");

const router = express.Router();

router.get("/", async (req, res) => {
  const teams = await Team.find({});
  res.json(teams);
});

router.post("/:teamId/lineup", async (req, res) => {

  const { starters, formation } = req.body;

  const team = await Team.findById(req.params.teamId);
  if (!team) return res.status(404).json({ message: "Team nicht gefunden" });

  const rules = formations[formation];
  if (!rules)
    return res.status(400).json({ message: "Ungültige Formation" });

  const selectedPlayers = team.players.filter(p =>
    starters.includes(p._id.toString())
  );

  if (selectedPlayers.length !== 11)
    return res.status(400).json({ message: "Es müssen genau 11 Spieler gewählt werden" });

  let count = {
    GK: 0,
    DEF: 0,
    CDM: 0,
    CM: 0,
    CAM: 0,
    WING: 0,
    ST: 0
  };

  selectedPlayers.forEach(p => {

    if (p.position === "GK") count.GK++;

    if (["CB", "LB", "RB"].includes(p.position))
      count.DEF++;

    if (p.position === "CDM") count.CDM++;
    if (p.position === "CM") count.CM++;
    if (p.position === "CAM") count.CAM++;

    if (["LW", "RW"].includes(p.position))
      count.WING++;

    if (p.position === "ST")
      count.ST++;
  });

  for (let key in rules) {
    if (count[key] !== rules[key]) {
      return res.status(400).json({
        message: `Formation falsch besetzt: ${key} stimmt nicht`
      });
    }
  }

  // Speichern
  team.players.forEach(player => {
    player.isStarting = starters.includes(player._id.toString());
  });

  team.formation = formation;

  await team.save();

  res.json({ message: "Startelf korrekt gespeichert" });
});

module.exports = router;