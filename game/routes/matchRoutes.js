const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

router.post("/play", matchController.playMatch);

router.get("/current", async (req, res) => {
  const matches = await Match.find().sort({ createdAt: -1 }).limit(9);
  res.json(matches);
});

router.get("/:id", async (req, res) => {
  const match = await Match.findById(req.params.id);
  res.json(match);
});

module.exports = router;

router.get("/:id", async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("homeTeam")
      .populate("awayTeam");

    res.json(match);
  } catch (err) {
    res.status(500).json({ error: "Match nicht gefunden" });
  }
});