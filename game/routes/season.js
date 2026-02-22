const express = require("express");
const router = express.Router();
const generateSeason = require("../utils/seasonGenerator");

router.post("/start", async (req, res) => {
  try {
    await generateSeason();
    res.json({ message: "Saison erfolgreich erstellt" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;