const Team = require("../models/Team");
const Match = require("../models/Match");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getNextThursday(baseDate) {
  const date = new Date(baseDate);
  const diff = (7 + 4 - date.getDay()) % 7;
  date.setDate(date.getDate() + diff);
  date.setHours(22, 0, 0, 0);
  return date;
}


// ==============================
// 🔥 ERSTE RUNDE GENERIEREN
// ==============================
async function generateFirstRound(country, startDate) {
  const teams = await Team.find({ country });

  const shuffled = shuffle([...teams]);
  const roundDate = getNextThursday(startDate);

  for (let i = 0; i < shuffled.length; i += 2) {
    if (!shuffled[i + 1]) break;

    const homeFirst = Math.random() < 0.5;

    await Match.create({
      homeTeam: homeFirst ? shuffled[i]._id : shuffled[i + 1]._id,
      awayTeam: homeFirst ? shuffled[i + 1]._id : shuffled[i]._id,
      competition: "CUP",
      country,
      round: 1,
      date: roundDate
    });
  }
}


// ==============================
// 🔥 NÄCHSTE RUNDE GENERIEREN
// ==============================
async function generateNextRound(country, roundNumber) {

  const matches = await Match.find({
    country,
    competition: "CUP",
    round: roundNumber,
    played: true
  });

  const winners = matches.map(match =>
    match.homeGoals > match.awayGoals
      ? match.homeTeam
      : match.awayTeam
  );

  if (winners.length < 2) return;

  const shuffled = shuffle([...winners]);

  const nextRound = roundNumber + 1;

  const lastMatch = matches[0];
  const nextDate = getNextThursday(lastMatch.date);

  for (let i = 0; i < shuffled.length; i += 2) {
    if (!shuffled[i + 1]) break;

    const homeFirst = Math.random() < 0.5;

    await Match.create({
      homeTeam: homeFirst ? shuffled[i] : shuffled[i + 1],
      awayTeam: homeFirst ? shuffled[i + 1] : shuffled[i],
      competition: "CUP",
      country,
      round: nextRound,
      date: nextDate
    });
  }
}

module.exports = {
  generateFirstRound,
  generateNextRound
};