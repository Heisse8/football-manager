const express = require("express");
const router = express.Router();
const Match = require("../models/Match");
const authMiddleware = require("../middleware/auth");
const Team = require("../models/Team");

router.get("/my-month", authMiddleware, async (req, res) => {
  try {
    const user = await Team.findOne({ owner: req.user.userId });

    if (!user) {
      return res.status(404).json({ message: "Kein Team gefunden" });
    }

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const matches = await Match.find({
      date: { $gte: start, $lte: end },
      $or: [
        { homeTeam: user._id },
        { awayTeam: user._id }
      ]
    })
    .populate("homeTeam awayTeam")
    .sort({ date: 1 });

    res.json(matches);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;