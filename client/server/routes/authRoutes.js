const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Club = require("../models/Club");
const Player = require("../models/Player");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY";

/* ================= REGISTER ================= */

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email bereits vergeben" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    /* -------- Club automatisch erstellen -------- */

    const newClub = new Club({
      name: `${username} FC`,
      shortName: username.substring(0,3).toUpperCase(),
      owner: newUser._id
    });

    await newClub.save();

    newUser.club = newClub._id;
    await newUser.save();

    /* -------- 18 Spieler generieren -------- */

    const positions = [
      "TW","IV","IV","IV","LV","RV",
      "ZM","ZM","ZDM","ZOM",
      "LW","RW","ST","ST",
      "IV","ZM","ST","LV"
    ];

    for (let i = 0; i < 18; i++) {
      await Player.create({
        name: `Spieler ${i+1}`,
        club: newClub._id,
        position: positions[i],
        positions: [positions[i]],
        overall: Math.floor(Math.random() * 50) + 40,
        stamina: Math.floor(Math.random() * 30) + 70
      });
    }

    /* -------- Token erstellen -------- */

    const token = jwt.sign(
      { userId: newUser._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      clubId: newClub._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= LOGIN ================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User nicht gefunden" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Falsches Passwort" });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      clubId: user.club
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;