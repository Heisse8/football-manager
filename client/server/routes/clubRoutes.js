const express = require("express");
const router = express.Router();

const Club = require("../models/Club");
const Player = require("../models/Player");

/* ================= POSITION LOGIK ================= */

const positionVariants = {
  TW: ["TW"],
  IV: ["IV","LV","RV"],
  LV: ["LV","LWB"],
  RV: ["RV","RWB"],
  ZDM: ["ZDM","ZM"],
  ZM: ["ZM","ZOM","ZDM"],
  ZOM: ["ZOM","ZM"],
  LW: ["LW","RW"],
  RW: ["RW","LW"],
  ST: ["ST"]
};

/* ================= CLUB ERSTELLEN ================= */

router.post("/create", async (req, res) => {
  try {

    const newClub = new Club(req.body);
    await newClub.save();

    const basePositions = [
      "TW",
      "LV","IV","IV","RV",
      "ZDM","ZM","ZM","ZOM",
      "ST","ST"
    ];

    const extraPool = [
      "IV","LV","RV","ZDM","ZM",
      "ZOM","LW","RW","ST"
    ];

    while (basePositions.length < 18) {
      basePositions.push(
        extraPool[Math.floor(Math.random()*extraPool.length)]
      );
    }

    /* ================= EINZIGARTIGE NAMEN ================= */

    const firstNames = [
      "Lukas","Noah","Ben","Jonas","Elias",
      "Leon","Felix","David","Finn","Paul",
      "Tim","Max","Julian","Moritz","Nico",
      "Lennard","Tom","Marvin","Jan","Tobias"
    ];

    const lastNames = [
      "Meyer","Schmidt","Müller","Wagner",
      "Schulz","Becker","Hoffmann","Richter",
      "Klein","Wolf","Schröder","Neumann",
      "Braun","Zimmermann","Hartmann"
    ];

    const usedNames = new Set();

    function generateUniqueName() {
      let name;
      do {
        name =
          firstNames[Math.floor(Math.random()*firstNames.length)]
          + " " +
          lastNames[Math.floor(Math.random()*lastNames.length)];
      } while (usedNames.has(name));
      usedNames.add(name);
      return name;
    }

    /* ================= BALANCED RATING ================= */

    function generateBalancedOverall() {
      const rand = Math.random();

      if (rand < 0.35) return Math.floor(Math.random()*10)+50;
      if (rand < 0.65) return Math.floor(Math.random()*10)+60;
      if (rand < 0.85) return Math.floor(Math.random()*5)+70;
      if (rand < 0.97) return Math.floor(Math.random()*5)+75;
      return Math.floor(Math.random()*3)+80;
    }

    /* ================= SPIELER ERSTELLEN ================= */

    const players = basePositions.map(position => {

      const variants = positionVariants[position] || [position];

      const randomExtra =
        variants[Math.floor(Math.random()*variants.length)];

      const positions = [...new Set([position, randomExtra])];

      return {
        club: newClub._id,
        name: generateUniqueName(),
        age: Math.floor(Math.random()*8) + 18,
        position,
        positions, // <-- Mehrere Positionen gespeichert
        overall: generateBalancedOverall(),
        stamina: 100
      };
    });

    await Player.insertMany(players);

    res.json({ club: newClub });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= CLUB + SPIELER LADEN ================= */

router.get("/:id", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const players = await Player.find({ club: req.params.id });

    res.json({ club, players });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;