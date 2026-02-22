const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ALLE USER LÖSCHEN (nur für Entwicklung!)
router.delete("/reset-users", async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: "Alle User wurden gelöscht." });
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Löschen" });
  }
});

module.exports = router;