const Match = require("../models/Match");

function getMatchDate(startDate, round) {
  const date = new Date(startDate);

  // Dienstag / Donnerstag Rhythmus
  const daysToAdd = (round - 1) * 2;
  date.setDate(date.getDate() + daysToAdd);

  date.setHours(22, 0, 0, 0);

  return date;
}

async function generateSchedule(teams, league, seasonStart) {
  const matches = [];
  const teamIds = teams.map(t => t._id);

  const totalRounds = teamIds.length - 1; // 17
  const half = teamIds.length / 2;

  let rotated = [...teamIds];

  // HINRUNDE
  for (let round = 0; round < totalRounds; round++) {
    for (let i = 0; i < half; i++) {
      matches.push({
        homeTeam: rotated[i],
        awayTeam: rotated[rotated.length - 1 - i],
        league,
        round: round + 1,
        date: getMatchDate(seasonStart, round + 1)
      });
    }

    // Rotation
    rotated.splice(1, 0, rotated.pop());
  }

  // RÜCKRUNDE
  const secondHalf = matches.map(match => ({
    homeTeam: match.awayTeam,
    awayTeam: match.homeTeam,
    league,
    round: match.round + totalRounds,
    date: getMatchDate(seasonStart, match.round + totalRounds)
  }));

  await Match.insertMany([...matches, ...secondHalf]);
}

module.exports = generateSchedule;