const express = require("express");
const router = express.Router();
const News = require("../models/News");

router.get("/league/:league", async (req, res) => {
  try {
    const news = await News.find({ league: req.params.league })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: "News konnten nicht geladen werden" });
  }
});

module.exports = router;