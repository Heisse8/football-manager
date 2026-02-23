const cron = require("node-cron");
const Match = require("../models/Match");
const Player = require("../models/Player");
const Team = require("../models/Team");
const Stadium = require("../models/Stadium");

const { simulateRealisticMatch } = require("../utils/realisticMatchEngine");
const { calculateAttendance } = require("../utils/matchEconomy");
const { generateMatchTicker } = require("../utils/eventTextGenerator");
const { generateKickerStyleReport } = require("../utils/aiMatchReport");

// ======================================================
// 🔒 22:00 LINEUP LOCK (Di, Do, Sa)
// ======================================================

cron.schedule("0 22 * * 2,4,6", async () => {

  const matches = await Match.find({ status: "scheduled" });

  for (const match of matches) {

    const homePlayers = await Player.find({
      team: match.homeTeam,
      startingXI: true,
      injuredUntil: { $lte: new Date() }
    });

    const awayPlayers = await Player.find({
      team: match.awayTeam,
      startingXI: true,
      injuredUntil: { $lte: new Date() }
    });

    if (homePlayers.length === 11 && awayPlayers.length === 11) {

      match.lockedLineups = {
        home: homePlayers.map(p => p._id),
        away: awayPlayers.map(p => p._id)
      };

      match.status = "lineups_locked";
      await match.save();
    }
  }
});


// ======================================================
// ⚽ 04:00 SPIELBERECHNUNG (Mi, Fr, So)
// ======================================================

cron.schedule("0 4 * * 3,5,0", async () => {

  const matches = await Match.find({
    status: "lineups_locked",
    played: false
  }).populate("homeTeam awayTeam");

  for (const match of matches) {

    // ================= SPIELER LADEN =================

    const homePlayers = await Player.find({
      _id: { $in: match.lockedLineups.home }
    });

    const awayPlayers = await Player.find({
      _id: { $in: match.lockedLineups.away }
    });

    // ================= STADION =================

    const stadium = await Stadium.findOne({ team: match.homeTeam._id });

    const { attendance, revenue, fillRate } =
      calculateAttendance({
        capacity: stadium.capacity,
        ticketPrice: stadium.ticketPrice,
        homePosition: match.homeTeam.tablePosition || 10,
        awayPosition: match.awayTeam.tablePosition || 10
      });

    // ================= MATCH ENGINE =================

    const result = simulateRealisticMatch({
      homePlayers,
      awayPlayers,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      stadium,
      fillRate
    });

    // ================= ERGEBNIS =================

    match.homeGoals = result.result.homeGoals;
    match.awayGoals = result.result.awayGoals;

    match.possession = result.possession;
    match.chances = result.chances;
    match.xG = result.xG;

    match.shots = {
      home: Math.round(result.chances.home * 1.4),
      away: Math.round(result.chances.away * 1.4)
    };

    match.shotsOnTarget = {
      home: Math.round(result.xG.home * 3),
      away: Math.round(result.xG.away * 3)
    };

    match.attendance = attendance;
    match.revenue = revenue;

    match.status = "played";
    match.played = true;

    // ================= EVENTS + TICKER =================

    match.events = result.events;
    match.ticker = generateMatchTicker(result.events);

    // ================= KI SPIELBERICHT =================

    match.summary = generateKickerStyleReport({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      possession: match.possession,
      xG: match.xG,
      statistics: result.statistics,
      events: result.events
    });

    // ================= EINNAHMEN =================

    match.homeTeam.balance += revenue;

    // ================= TABELLE UPDATE =================

    match.homeTeam.goalsFor += match.homeGoals;
    match.homeTeam.goalsAgainst += match.awayGoals;

    match.awayTeam.goalsFor += match.awayGoals;
    match.awayTeam.goalsAgainst += match.homeGoals;

    match.homeTeam.goalDifference =
      match.homeTeam.goalsFor - match.homeTeam.goalsAgainst;

    match.awayTeam.goalDifference =
      match.awayTeam.goalsFor - match.awayTeam.goalsAgainst;

    if (match.homeGoals > match.awayGoals) {
      match.homeTeam.points += 3;
      match.homeTeam.wins += 1;
      match.awayTeam.losses += 1;
    } else if (match.homeGoals < match.awayGoals) {
      match.awayTeam.points += 3;
      match.awayTeam.wins += 1;
      match.homeTeam.losses += 1;
    } else {
      match.homeTeam.points += 1;
      match.awayTeam.points += 1;
      match.homeTeam.draws += 1;
      match.awayTeam.draws += 1;
    }

    // ================= SPEICHERN =================

    await match.homeTeam.save();
    await match.awayTeam.save();
    await match.save();

    // ================= TABELLE SORTIEREN =================

    const teams = await Team.find({ league: match.league })
      .sort({
        points: -1,
        goalDifference: -1,
        goalsFor: -1
      });

    for (let i = 0; i < teams.length; i++) {
      teams[i].tablePosition = i + 1;
      await teams[i].save();
    }
  }
});