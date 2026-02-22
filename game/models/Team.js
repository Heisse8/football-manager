router.post("/create", authMiddleware, async (req, res) => {
  const { name, shortName, logo } = req.body;

  const user = await User.findById(req.user.userId);

  if (user.club) {
    return res.status(400).json({ message: "Team existiert bereits" });
  }

  const newTeam = new Team({
    name,
    shortName,
    logo,
    players: generateSquad()
  });

  await newTeam.save();

  user.club = newTeam._id;
  await user.save();

  res.json({ message: "Team erstellt" });
});