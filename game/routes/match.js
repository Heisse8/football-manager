router.get("/:id", async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("homeTeam")
      .populate("awayTeam");

    if (!match) return res.status(404).json({ error: "Match nicht gefunden" });

    res.json(match);
  } catch (err) {
    res.status(500).json({ error: "Serverfehler" });
  }
});

const auth = require("../middleware/auth");
const Team = require("../models/Team");

router.get("/my-month", auth, async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || month === undefined) {
      return res.status(400).json({ error: "Year und Month fehlen" });
    }

    // 🔥 Team des eingeloggten Users finden
    const team = await Team.findOne({ owner: req.user.userId });
    if (!team) {
      return res.status(404).json({ error: "Kein Team gefunden" });
    }

    const start = new Date(year, month, 1);
    const end = new Date(year, Number(month) + 1, 1);

    const matches = await Match.find({
      date: { $gte: start, $lt: end },
      $or: [
        { homeTeam: team._id },
        { awayTeam: team._id }
      ]
    })
      .populate("homeTeam", "name")
      .populate("awayTeam", "name")
      .sort({ date: 1 });

    res.json(matches);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Laden des Monats" });
  }
});