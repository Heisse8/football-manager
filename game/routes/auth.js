const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Team = require("../models/Team");
const League = require("../models/League");
const Invite = require("../models/Invite");

const router = express.Router();

const JWT_SECRET = "SUPER_SECRET_KEY_CHANGE_THIS";

/* =========================
   CREATE LEAGUE (einmalig)
========================= */

router.post("/create-league", async (req, res) => {
  try {
    const { name } = req.body;

    const league = await League.create({
      name,
      teams: [],
      currentWeek: 1,
      status: "active"
    });

    res.json({ leagueId: league._id });
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Erstellen der Liga" });
  }
});

/* =========================
   CREATE INVITE (Admin)
========================= */

router.post("/create-invite", async (req, res) => {
  try {
    const { leagueId } = req.body;

    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const invite = await Invite.create({
      code,
      league: leagueId
    });

    res.json({ inviteCode: invite.code });
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Erstellen des Invites" });
  }
});

/* =========================
   REGISTER WITH INVITE
========================= */

router.post("/register", async (req, res) => {
  try {
    const { email, password, inviteCode, teamName } = req.body;

    const invite = await Invite.findOne({ code: inviteCode });

    if (!invite || invite.used) {
      return res.status(400).json({ message: "Ungültiger Invite Code" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email bereits registriert" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const team = await Team.create({
      name: teamName,
      formation: "4-3-3",
      style: "possession",
      lineHeight: "medium",
      pressing: "medium",
      players: Array.from({ length: 11 }).map(() => ({
        rating: 65 + Math.random() * 15,
        role: "BoxToBox",
        fitness: 1,
        injured: false,
        injuryWeeks: 0
      }))
    });

    const user = await User.create({
      email,
      passwordHash,
      team: team._id,
      league: invite.league
    });

    // Team zur Liga hinzufügen
    await League.findByIdAndUpdate(invite.league, {
      $push: { teams: team._id }
    });

    invite.used = true;
    await invite.save();

    res.json({ message: "Registrierung erfolgreich" });
  } catch (err) {
    res.status(500).json({ message: "Fehler bei Registrierung" });
  }
});

/* =========================
   LOGIN
========================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User nicht gefunden" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ message: "Falsches Passwort" });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login Fehler" });
  }
});

module.exports = router;