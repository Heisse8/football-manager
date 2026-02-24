const cron = require("node-cron");
const Match = require("../models/Match");
const Player = require("../models/Player");
const Team = require("../models/Team");
const Stadium = require("../models/Stadium");

const { simulateRealisticMatch } = require("../engines/realisticMatchEngine");
const { calculateAttendance } = require("../utils/matchEconomy");
const { generateMatchTicker } = require("../utils/eventTextGenerator");
const { generateKickerStyleReport } = require("../utils/aiMatchReport");

/* ======================================================
 🔒 LINEUP LOCK
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
});

/* ======================================================
 ⚽ SPIELBERECHNUNG
====================================================== */

cron.schedule("0 4 * * 3,5,0", async () => {

  console.log("⚽ Spielberechnung gestartet");

  const matches = await Match.find({
    status: "lineups_locked",
    played: false,
  }).populate("homeTeam awayTeam");

  for (const match of matches) {

    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;

    if (!homeTeam.lockedLineup || !awayTeam.lockedLineup) continue;

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

    const stadium = await Stadium.findOne({ team: homeTeam._id });
    if (!stadium) continue;

    const { attendance, revenue, fillRate } =
      calculateAttendance({
        capacity: stadium.capacity,
        ticketPrice: stadium.ticketPrice,
        homePosition: homeTeam.tablePosition || 10,
        awayPosition: awayTeam.tablePosition || 10,
      });

    const result = simulateRealisticMatch({
      homePlayers,
      awayPlayers,
      homeTeam,
      awayTeam,
      stadium,
      fillRate,
    });

    /* ===== Ergebnis speichern ===== */

    match.homeGoals = result.result.homeGoals;
    match.awayGoals = result.result.awayGoals;
    match.possession = result.possession;
    match.chances = result.chances;
    match.xG = result.xG;
    match.events = result.events;
    match.ticker = generateMatchTicker(result.events);

    match.summary = generateKickerStyleReport({
      homeTeam,
      awayTeam,
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      possession: match.possession,
      xG: match.xG,
      events: result.events,
    });

    match.attendance = attendance;
    match.revenue = revenue;
    match.played = true;
    match.status = "played";

    /* ===== Tabelle ===== */

    updateTable(homeTeam, awayTeam, match);

    /* ===== Einnahmen ===== */

    homeTeam.balance += revenue;

    homeTeam.lineupLocked = false;
    awayTeam.lineupLocked = false;

    await Promise.all([
      homeTeam.save(),
      awayTeam.save(),
      match.save()
    ]);

    /* ===== Tabelle sortieren ===== */

    const teams = await Team.find({ league: homeTeam.league })
      .sort({ points: -1, goalDifference: -1, goalsFor: -1 });

    teams.forEach((team, index) => {
      team.tablePosition = index + 1;
    });

    await Promise.all(teams.map(team => team.save()));
  }

  console.log("✅ Spielberechnung abgeschlossen");
});

/* ======================================================
 Tabellenlogik
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