const Match = require("../models/Match");
const Team = require("../models/Team");
const { simulateRealisticMatch } = require("../engine/matchEngine");

exports.playMatch = async (req, res) => {
  try {
    const { homeTeamId, awayTeamId } = req.body;

    const homeTeam = await Team.findById(homeTeamId);
    const awayTeam = await Team.findById(awayTeamId);

    const result = simulateRealisticMatch({
      homeTeam,
      awayTeam
    });

    const match = await Match.create({
      homeTeam: homeTeam.name,
      awayTeam: awayTeam.name,
      ...result
    });

    res.json(match);

  } catch (err) {
    res.status(500).json({ error: "Match konnte nicht gespielt werden" });
  }
};