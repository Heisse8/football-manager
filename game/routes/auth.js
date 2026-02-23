const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");

const User = require("../models/User");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email bereits vergeben" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false
    });

    await newUser.save();

    const verificationLink =
      `https://football-manager-2.onrender.com/api/auth/verify/${verificationToken}`;

    try {
      await sgMail.send({
        to: email,
        from: process.env.EMAIL_USER,
        subject: "Bestätige deinen Football Manager Account ⚽",
        html: `
          <h2>Willkommen beim Football Manager ⚽</h2>
          <p>Klicke auf den Link, um deinen Account zu bestätigen:</p>
          <a href="${verificationLink}">${verificationLink}</a>
        `
      });

      console.log("✅ Email erfolgreich gesendet an:", email);

    } catch (mailError) {
      console.error("❌ SendGrid Fehler:", mailError.response?.body || mailError.message);
    }

    res.status(201).json({
      message: "Bestätigungsmail wurde gesendet!"
    });

  } catch (err) {
    console.error("❌ Register Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

// ================= VERIFY =================
router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token
    });

    if (!user) {
      return res.status(400).send("Ungültiger Token");
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ RICHTIGE DOMAIN
    res.redirect(
      `https://football-manager-2.onrender.com/verify-success?token=${jwtToken}`
    );

  } catch (err) {
    console.error("❌ Verify Fehler:", err);
    res.status(500).send("Serverfehler");
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User nicht gefunden" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Bitte bestätige zuerst deine Email."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Falsches Passwort" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("❌ Login Fehler:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

module.exports = router;