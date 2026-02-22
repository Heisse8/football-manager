const Team = require("../models/Team");
const Match = require("../models/Match");

function getNextWeekday(baseDate, weekday, hour = 22) {
  const date = new Date(baseDate);
  const diff = (7 + weekday - date.getDay()) % 7;
  date.setDate(date.getDate() + diff);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function generateLeagueSchedule(league) {
  const teams = await Team.find({ league });

  if (teams.length !== 18) return;

  const startDate = new Date();
  let currentDate = getNextWeekday(startDate, 2); // Dienstag

  const rounds = teams.length - 1; // 17
  const matchesPerRound = teams.length / 2; // 9

  const teamList = [...teams];

  for (let round = 0; round < rounds * 2; round++) {
    for (let i = 0; i < matchesPerRound; i++) {
      const home = teamList[i];
      const away = teamList[teamList.length - 1 - i];

      await Match.create({
        homeTeam: round < rounds ? home._id : away._id,
        awayTeam: round < rounds ? away._id : home._id,
        competition: "LEAGUE",
        league,
        country: league.split("_")[0],
        matchday: round + 1,
        date: new Date(currentDate)
      });
    }

    // Rotation
    teamList.splice(1, 0, teamList.pop());

    // Dienstag + Samstag Wechsel
    if (currentDate.getDay() === 2) {
      currentDate = getNextWeekday(currentDate, 6); // Samstag
    } else {
      currentDate = getNextWeekday(currentDate, 2); // Dienstag
    }
  }
}

async function generateCup(country) {
  const teams = await Team.find({ country });
  const shuffled = shuffle(teams);

  let roundTeams = shuffled;
  let round = 1;

  let currentDate = getNextWeekday(new Date(), 4); // Donnerstag

  while (roundTeams.length > 1) {
    const nextRound = [];

    for (let i = 0; i < roundTeams.length; i += 2) {
      const home = roundTeams[i];
      const away = roundTeams[i + 1];

      await Match.create({
        homeTeam: home._id,
        awayTeam: away._id,
        competition: "CUP",
        country,
        round,
        date: new Date(currentDate)
      });

      nextRound.push(home); // Platzhalter – Sieger später berechnet
    }

    roundTeams = nextRound;
    round++;
    currentDate.setDate(currentDate.getDate() + 7); // nächste Woche Donnerstag
  }
}

module.exports = {
  generateLeagueSchedule,
  generateCup
};