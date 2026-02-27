const cron = require("node-cron");
const Match = require("../models/Match");
const Player = require("../models/Player");
const Team = require("../models/Team");
const Stadium = require("../models/Stadium");


const { simulateRealisticMatch } = require("../engine/matchEngine");
const { calculateAttendance } = require("../utils/matchEconomy");
const { generateMatchTicker } = require("../utils/eventTextGenerator");
const { generateKickerStyleReport } = require("../utils/aiMatchReport");
const News = require("../models/News");

/* ======================================================
 🔒 LINEUP LOCK (22:00)
====================================================== */

cron.schedule("0 22 * * 2,4,6", async () => {

  console.log("🔒 Lineup Lock gestartet");

  const matches = await Match.find({ status: "scheduled" });

  for (const match of matches) {

    const homeTeam = await Team.findById(match.homeTeam);
    const awayTeam = await Team.findById(match.awayTeam);

    if (!homeTeam || !awayTeam) continue;

    if (!homeTeam.lineupLocked) {
      homeTeam.lockedLineup = homeTeam.lineup;
      homeTeam.lockedBench = homeTeam.bench;
      homeTeam.lineupLocked = true;
      await homeTeam.save();
    }

    if (!awayTeam.lineupLocked) {
      awayTeam.lockedLineup = awayTeam.lineup;
      awayTeam.lockedBench = awayTeam.bench;
      awayTeam.lineupLocked = true;
      await awayTeam.save();
    }

    match.status = "lineups_locked";
    await match.save();
  }

  console.log("✅ Lineups gelockt");

}, { timezone: "Europe/Berlin" });

/* ======================================================
 ⚽ SPIELBERECHNUNG (04:00)
====================================================== */

cron.schedule("0 4 * * 3,5,0", async () => {

  console.log("⚽ Spielberechnung gestartet");

  const matches = await Match.find({
  status: "lineups_locked",
  played: false
});

  for (const match of matches) {

    if (match.played) continue;

    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;

    if (!homeTeam.lockedLineup || !awayTeam.lockedLineup) continue;

    /* ==============================
       🔄 Lineup → Spieler laden
    ============================== */

    const homePlayerIds = Object.values(homeTeam.lockedLineup)
      .map(slot => slot.player);

    const awayPlayerIds = Object.values(awayTeam.lockedLineup)
      .map(slot => slot.player);

    const homePlayers = await Player.find({ _id: { $in: homePlayerIds } });
    const awayPlayers = await Player.find({ _id: { $in: awayPlayerIds } });

    if (homePlayers.length < 11 || awayPlayers.length < 11) {
      console.log("⚠️ Ungültiges Lineup");
      continue;
    }

    /* ==============================
       🧠 Engine kompatibel machen
    ============================== */

    homeTeam.lineup = homePlayers;
    awayTeam.lineup = awayPlayers;

    /* ==============================
       ⚽ MATCH SIMULATION
    ============================== */

    const result = simulateRealisticMatch({
      homeTeam,
      awayTeam
    });

    if (match.competition === "cup") {

  const winner =
    match.homeGoals > match.awayGoals
      ? match.homeTeam
      : match.awayTeam;

  await advanceCupTeam(match, winner);

  async function advanceCupTeam(match, winnerId) {
  const nextMatch = await Match.findOne({
    competition: "cup",
    season: match.season,
    cupRound: getNextRound(match.cupRound),
    homeTeam: null
  });

  if (nextMatch) {
    if (!nextMatch.homeTeam) {
      nextMatch.homeTeam = winnerId;
    } else {
      nextMatch.awayTeam = winnerId;
    }

    await nextMatch.save();
  }
}
}

await News.create({
  league: homeTeam.league,
  type: "match",
  title: `${homeTeam.name} ${match.homeGoals}:${match.awayGoals} ${awayTeam.name}`,
  content: match.summary,
  relatedMatch: match._id
});

    /* ==============================
       🎟 Zuschauer & Einnahmen
    ============================== */

    const stadium = await Stadium.findOne({ team: homeTeam._id });

    let attendance = 0;
    let revenue = 0;

    if (stadium) {
      const data = calculateAttendance({
        capacity: stadium.capacity,
        ticketPrice: stadium.ticketPrice,
        homePosition: homeTeam.tablePosition || 10,
        awayPosition: awayTeam.tablePosition || 10
      });

      attendance = data.attendance;
      revenue = data.revenue;
    }

    /* ==============================
       💾 Ergebnis speichern
    ============================== */

    match.homeGoals = result.homeGoals;
    match.awayGoals = result.awayGoals;
    match.xG = result.xG;
    match.possession = result.possession;
    match.stats = result.stats;
    match.events = result.events;

    match.ticker = generateMatchTicker(result.events);

    match.summary = generateKickerStyleReport({
      homeTeam,
      awayTeam,
      homeGoals: result.homeGoals,
      awayGoals: result.awayGoals,
      possession: result.possession,
      xG: result.xG,
      events: result.events
    });

    match.attendance = attendance;
    match.revenue = revenue;
    match.played = true;
    match.status = "played";

    /* ==============================
       📊 Tabelle aktualisieren
    ============================== */

    updateTable(homeTeam, awayTeam, match);

    homeTeam.balance += revenue;

    homeTeam.lineupLocked = false;
    awayTeam.lineupLocked = false;

    await Promise.all([
      homeTeam.save(),
      awayTeam.save(),
      match.save()
    ]);

    /* Tabelle neu sortieren */

    const teams = await Team.find({ league: homeTeam.league })
      .sort({ points: -1, goalDifference: -1, goalsFor: -1 });

    teams.forEach((team, index) => {
      team.tablePosition = index + 1;
    });

    await Promise.all(teams.map(team => team.save()));
  }

  console.log("✅ Spielberechnung abgeschlossen");

}, { timezone: "Europe/Berlin" });

/* ======================================================
 📊 Tabellenlogik
====================================================== */

function updateTable(homeTeam, awayTeam, match) {

  homeTeam.goalsFor += match.homeGoals;
  homeTeam.goalsAgainst += match.awayGoals;

  awayTeam.goalsFor += match.awayGoals;
  awayTeam.goalsAgainst += match.homeGoals;

  homeTeam.goalDifference =
    homeTeam.goalsFor - homeTeam.goalsAgainst;

  awayTeam.goalDifference =
    awayTeam.goalsFor - awayTeam.goalsAgainst;

  if (match.homeGoals > match.awayGoals) {
    homeTeam.points += 3;
    homeTeam.wins += 1;
    awayTeam.losses += 1;
  } else if (match.homeGoals < match.awayGoals) {
    awayTeam.points += 3;
    awayTeam.wins += 1;
    homeTeam.losses += 1;
  } else {
    homeTeam.points += 1;
    awayTeam.points += 1;
    homeTeam.draws += 1;
    awayTeam.draws += 1;
  }
}