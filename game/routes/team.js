router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, shortName } = req.body;

    if (!name || !shortName) {
      return res.status(400).json({ message: "Name und Kürzel erforderlich" });
    }

    const user = await User.findById(req.user.userId);

    if (user.club) {
      return res.status(400).json({ message: "Team existiert bereits" });
    }

    const leagues = [
      "GER_1", "GER_2",
      "ENG_1", "ENG_2",
      "ESP_1", "ESP_2",
      "FRA_1", "FRA_2",
      "ITA_1", "ITA_2"
    ];

    let assignedLeague = null;

    for (let league of leagues) {
      const count = await Team.countDocuments({ league });
      if (count < 18) {
        assignedLeague = league;
        break;
      }
    }

    if (!assignedLeague) {
      return res.status(500).json({ message: "Alle Ligen sind voll" });
    }

    const newTeam = new Team({
      name,
      shortName,
      league: assignedLeague,
      country: assignedLeague.split("_")[0],
      players: generateSquad()
    });

    await newTeam.save();

    user.club = newTeam._id;
    await user.save();

    res.status(201).json({
      message: "Team erfolgreich erstellt",
      team: newTeam
    });

  } catch (err) {
    res.status(500).json({ message: "Serverfehler", error: err.message });
  }
});