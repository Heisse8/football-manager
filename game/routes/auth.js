const express = require("express");
const router = express.Router();

/* =========================
   REGISTER
========================= */

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username und Passwort erforderlich"
      });
    }

    // Demo-User (später mit MongoDB ersetzen)
    return res.status(201).json({
      message: "User erfolgreich registriert",
      token: "demo-token",
      clubId: "demo-club-id",
      user: {
        username,
        email
      }
    });

  } catch (error) {
    console.error("Register Fehler:", error);
    return res.status(500).json({
      message: "Server Fehler"
    });
  }
});


/* =========================
   LOGIN
========================= */

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username und Passwort erforderlich"
      });
    }

    return res.json({
      message: "Login erfolgreich",
      token: "demo-token",
      clubId: "demo-club-id"
    });

  } catch (error) {
    console.error("Login Fehler:", error);
    return res.status(500).json({
      message: "Server Fehler"
    });
  }
});

module.exports = router;