const cron = require("node-cron");
const Match = require("../models/Match");
const Player = require("../models/Player");
const Team = require("../models/Team");
const Stadium = require("../models/Stadium");

const { simulateRealisticMatch } = require("../utils/realisticMatchEngine");
const { calculateAttendance } = require("../utils/matchEconomy");
const { generateMatchTicker } = require("../utils/eventTextGenerator");
const { generateKickerStyleReport } = require("../utils/aiMatchReport");

/* ======================================================
   🔒 22:00 LINEUP LOCK (Di, Do, Sa)
====================================================== */

cron.schedule("0 22 * * 2,4,6", async () => {
  console.log("🔒 Lineup Lock gestartet");

  const matches = await Match.find({
    status: "scheduled",
  });

  for (const match of matches) {

    const homeTeam = await Team.findById(match.homeTeam);
    const awayTeam = await Team.findById(match.awayTeam);

    if (!homeTeam || !awayTeam) continue;

    // Nur locken wenn noch nicht gesperrt
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
   ⚽ 04:00 SPIELBERECHNUNG (Mi, Fr, So)
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

    // 🔥 Locked Lineup verwenden
    const homePlayerIds = Object.values(homeTeam.lockedLineup || {});
    const awayPlayerIds = Object.values(awayTeam.lockedLineup || {});

    const homePlayers = await Player.find({
      _id: { $in: homePlayerIds },
    });

    const awayPlayers = await Player.find({
      _id: { $in: awayPlayerIds },
    });

    // ================= STADION =================

    const stadium = await Stadium.findOne({
      team: homeTeam._id,
    });

    const { attendance, revenue, fillRate } =
      calculateAttendance({
        capacity: stadium.capacity,
        ticketPrice: stadium.ticketPrice,
        homePosition: homeTeam.tablePosition || 10,
        awayPosition: awayTeam.tablePosition || 10,
      });

    // ================= MATCH ENGINE =================

    const result = simulateRealisticMatch({
      homePlayers,
      awayPlayers,
      homeTeam,
      awayTeam,
      stadium,
      fillRate,
    });

    // ================= ERGEBNIS =================

    match.homeGoals = result.result.homeGoals;
    match.awayGoals = result.result.awayGoals;

    match.possession = result.possession;
    match.chances = result.chances;
    match.xG = result.xG;

    match.shots = {
      home: Math.round(result.chances.home * 1.4),
      away: Math.round(result.chances.away * 1.4),
    };

    match.shotsOnTarget = {
      home: Math.round(result.xG.home * 3),
      away: Math.round(result.xG.away * 3),
    };

    match.attendance = attendance;
    match.revenue = revenue;

    match.status = "played";
    match.played = true;

    // ================= EVENTS =================

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

    // ================= EINNAHMEN =================

    homeTeam.balance += revenue;

    // ================= TABELLE UPDATE =================

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

    // 🔓 Lineup wieder freigeben
    homeTeam.lineupLocked = false;
    awayTeam.lineupLocked = false;

    // ================= SPEICHERN =================

    await homeTeam.save();
    await awayTeam.save();
    await match.save();

    // ================= TABELLE SORTIEREN =================

    const teams = await Team.find({
      league: homeTeam.league,
    }).sort({
      points: -1,
      goalDifference: -1,
      goalsFor: -1,
    });

    for (let i = 0; i < teams.length; i++) {
      teams[i].tablePosition = i + 1;
      await teams[i].save();
    }
  }

  console.log("✅ Spielberechnung abgeschlossen");
});