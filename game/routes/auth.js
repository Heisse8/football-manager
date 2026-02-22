const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "User erstellt" });
  } catch (err) {
    res.status(400).json({ error: "Registrierung fehlgeschlagen" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User nicht gefunden" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Falsches Passwort" });

    res.json({ message: "Login erfolgreich" });
  } catch (err) {
    res.status(400).json({ error: "Login fehlgeschlagen" });
  }
});

module.exports = router;