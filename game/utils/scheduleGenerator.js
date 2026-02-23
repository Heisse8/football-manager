const Team = require("../models/Team");
const Match = require("../models/Match");

/* ================= DATUM LOGIK ================= */

function getMatchDate(startDate, round) {
  const date = new Date(startDate);

  // Jede Runde 2 Tage Abstand (Di/Do Rhythmus)
  const daysToAdd = (round - 1) * 2;
  date.setDate(date.getDate() + daysToAdd);

  date.setHours(22, 0, 0, 0);

  return date;
}

/* ================= LIGA SPIELPLAN ================= */

async function generateLeagueSchedule(leagueCode) {

  const teams = await Team.find({ league: leagueCode });

  if (teams.length !== 18) {
    throw new Error(`Liga ${leagueCode} hat nicht genau 18 Teams.`);
  }

  const teamIds = teams.map(t => t._id);
  const totalRounds = teamIds.length - 1; // 17
  const half = teamIds.length / 2;

  const seasonStart = new Date(); // Saisonstart = jetzt
  const matches = [];

  let rotated = [...teamIds];

  // HINRUNDE
  for (let round = 0; round < totalRounds; round++) {

    for (let i = 0; i < half; i++) {
      matches.push({
        homeTeam: rotated[i],
        awayTeam: rotated[rotated.length - 1 - i],
        league: leagueCode,
        round: round + 1,
        date: getMatchDate(seasonStart, round + 1),
        played: false
      });
    }

    // Rotation (Round Robin Algorithmus)
    rotated.splice(1, 0, rotated.pop());
  }

  // RÜCKRUNDE (Heim/Auswärts tauschen)
  const secondHalf = matches.map(match => ({
    homeTeam: match.awayTeam,
    awayTeam: match.homeTeam,
    league: leagueCode,
    round: match.round + totalRounds,
    date: getMatchDate(seasonStart, match.round + totalRounds),
    played: false
  }));

  await Match.insertMany([...matches, ...secondHalf]);

  console.log(`✅ Spielplan für ${leagueCode} erstellt`);
}

/* ================= POKAL (Platzhalter) ================= */

async function generateCup(countryCode) {
  console.log(`🏆 Pokal für ${countryCode} generiert (Placeholder)`);
}

/* ================= EXPORT ================= */

module.exports = {
  generateLeagueSchedule,
  generateCup
};