const express = require("express");
const router = express.Router();
const Stadium = require("../models/Stadium");
const Team = require("../models/Team");
const auth = require("../middleware/auth");

// ================= EXPANSION CONFIG =================

const expansionConfig = {
  2000: { next: 4000, cost: 750000, duration: 8 },
  4000: { next: 8000, cost: 1800000, duration: 14 },
  8000: { next: 16000, cost: 4000000, duration: 22 },
  16000: { next: 32000, cost: 9000000, duration: 34 },
  32000: { next: 64000, cost: 22000000, duration: 60 },
  64000: { next: 81365, cost: 45000000, duration: 100 }
};

// ================= GET STADIUM =================

router.get("/", auth, async (req, res) => {
  try {
    const team = await Team.findOne({ owner: req.user.userId });
    if (!team) return res.status(404).json({ message: "Team nicht gefunden." });

    const stadium = await Stadium.findOne({ team: team._id });
    if (!stadium) return res.status(404).json({ message: "Stadion nicht gefunden." });

    // Fortschritt berechnen
    let progress = 0;
    let remainingMatchdays = 0;

    if (stadium.construction.inProgress) {
      const total =
        stadium.construction.finishMatchday -
        stadium.construction.startMatchday;

      const current =
        team.currentMatchday -
        stadium.construction.startMatchday;

      progress = Math.min(100, Math.max(0, (current / total) * 100));

      remainingMatchdays =
        stadium.construction.finishMatchday - team.currentMatchday;
    }

    res.json({
      ...stadium.toObject(),
      progress,
      remainingMatchdays
    });

  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

// ================= SET STADIUM NAME =================

router.put("/set-name", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.length > 30) {
      return res.status(400).json({ message: "Ungültiger Name." });
    }

    const team = await Team.findOne({ owner: req.user.userId });
    const stadium = await Stadium.findOne({ team: team._id });

    if (stadium.name) {
      return res.status(400).json({ message: "Name bereits gesetzt." });
    }

    stadium.name = name.trim();
    await stadium.save();

    res.json(stadium);

  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

// ================= SET TICKET PRICE =================

router.put("/ticket-price", auth, async (req, res) => {
  try {
    const { price } = req.body;

    if (price < 5 || price > 100) {
      return res.status(400).json({ message: "Ticketpreis 5€–100€ erlaubt." });
    }

    const team = await Team.findOne({ owner: req.user.userId });
    const stadium = await Stadium.findOne({ team: team._id });

    stadium.ticketPrice = price;
    await stadium.save();

    res.json(stadium);

  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

// ================= START EXPANSION =================

router.post("/expand", auth, async (req, res) => {
  try {
    const team = await Team.findOne({ owner: req.user.userId });
    const stadium = await Stadium.findOne({ team: team._id });

    if (stadium.construction.inProgress)
      return res.status(400).json({ message: "Ausbau läuft bereits." });

    const config = expansionConfig[stadium.capacity];
    if (!config)
      return res.status(400).json({ message: "Maximale Stufe erreicht." });

    if (team.balance < config.cost)
      return res.status(400).json({ message: "Nicht genug Geld." });

    team.balance -= config.cost;
    await team.save();

    stadium.construction = {
      inProgress: true,
      targetCapacity: config.next,
      startMatchday: team.currentMatchday,
      finishMatchday: team.currentMatchday + config.duration
    };

    await stadium.save();

    res.json(stadium);

  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

// ================= CHECK CONSTRUCTION =================

router.post("/check-construction", auth, async (req, res) => {
  try {
    const team = await Team.findOne({ owner: req.user.userId });
    const stadium = await Stadium.findOne({ team: team._id });

    if (
      stadium.construction.inProgress &&
      team.currentMatchday >= stadium.construction.finishMatchday
    ) {
      stadium.capacity = stadium.construction.targetCapacity;
      stadium.construction = {
        inProgress: false,
        targetCapacity: null,
        startMatchday: null,
        finishMatchday: null
      };

      await stadium.save();
    }

    res.json(stadium);

  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

module.exports = router;