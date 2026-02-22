const express = require("express");
const router = express.Router();

// Registrierung
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username und Passwort erforderlich" });
  }

  return res.status(201).json({
    message: "User erfolgreich registriert",
    user: { username }
  });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  return res.json({
    message: "Login erfolgreich",
    token: "demo-token"
  });
});

module.exports = router;