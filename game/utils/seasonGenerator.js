const Team = require("../models/Team");
const Match = require("../models/Match");

// Hilfsfunktion: nächster bestimmter Wochentag
function getNextWeekday(baseDate, weekday, hour = 22) {
  const date = new Date(baseDate);
  const diff = (7 + weekday - date.getDay()) % 7;
  date.setDate(date.getDate() + diff);
  date.setHours(hour, 0, 0, 0);
  return date;
}

// =============================
// 🔥 LIGA GENERIEREN
// =============================
async function generateLeague(league) {
  const teams = await Team.find({ league });

  if (teams.length !== 18) return null;

  const rounds = teams.length - 1; // 17
  const matchesPerRound = teams.length / 2; // 9
  const teamList = [...teams];

  let currentDate = getNextWeekday(new Date(), 2); // Dienstag
  let lastDate = null;

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

    teamList.splice(1, 0, teamList.pop());

    // Di / Sa Wechsel
    if (currentDate.getDay() === 2) {
      currentDate = getNextWeekday(currentDate, 6); // Samstag
    } else {
      currentDate = getNextWeekday(currentDate, 2); // Dienstag
    }

    lastDate = currentDate;
  }

  return lastDate;
}

// =============================
// 🔥 POKAL GENERIEREN
// =============================
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function generateCup(country, leagueEndDate) {
  const teams = await Team.find({ country });

  if (teams.length < 2) return;

  // Finale = Donnerstag nach letztem Ligaspiel
  const finalDate = getNextWeekday(leagueEndDate, 4);

  let roundTeams = shuffle([...teams]);
  let round = 1;

  // Anzahl Runden berechnen
  const totalRounds = Math.ceil(Math.log2(roundTeams.length));

  let roundDate = new Date(finalDate);

  for (let r = totalRounds; r > 0; r--) {
    roundDate.setDate(roundDate.getDate() - 7); // jede Woche zurück
  }

  roundDate = getNextWeekday(roundDate, 4);

  while (roundTeams.length > 1) {
    const shuffled = shuffle([...roundTeams]);
    const nextRound = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      if (!shuffled[i + 1]) break;

      const homeFirst = Math.random() < 0.5;

      await Match.create({
        homeTeam: homeFirst ? shuffled[i]._id : shuffled[i + 1]._id,
        awayTeam: homeFirst ? shuffled[i + 1]._id : shuffled[i]._id,
        competition: "CUP",
        country,
        round,
        date: new Date(roundDate)
      });

      nextRound.push(shuffled[i]); // Platzhalter (Sieger später)
    }

    roundTeams = nextRound;
    round++;
    roundDate.setDate(roundDate.getDate() + 7);
  }

  // Finale erstellen
  await Match.create({
    homeTeam: roundTeams[0]._id,
    awayTeam: roundTeams[1]?._id,
    competition: "CUP",
    country,
    round,
    date: finalDate
  });
}

// =============================
// 🔥 GESAMTE SAISON STARTEN
// =============================
async function generateSeason() {
  const leagues = [
    "GER_1","GER_2",
    "ENG_1","ENG_2",
    "ESP_1","ESP_2",
    "FRA_1","FRA_2",
    "ITA_1","ITA_2"
  ];

  const countries = ["GER","ENG","ESP","FRA","ITA"];

  let leagueEndDates = {};

  for (let league of leagues) {
    const endDate = await generateLeague(league);
    if (endDate) {
      leagueEndDates[league.split("_")[0]] = endDate;
    }
  }

  for (let country of countries) {
    if (leagueEndDates[country]) {
      await generateCup(country, leagueEndDates[country]);
    }
  }
}

module.exports = generateSeason;