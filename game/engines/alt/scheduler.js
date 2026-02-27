const cron = require("node-cron");
const Team = require("../../models/Team");
const League = require("../../models/League");
const { simulateMatch } = require("./matchEngine");

/* =========================
   SPIELTAG SIMULIEREN
========================= */

async function simulateMatchday() {

  const league = await League.findOne();
  if (!league) return;

  const matchdayIndex = league.currentMatchday - 1;
  const matches = league.schedule[matchdayIndex];

  if (!matches) {
    console.log("ℹ️ Keine weiteren Spieltage vorhanden");
    return;
  }

  console.log("⚽ Simulation gestartet...");

  for (const match of matches) {

    if (match.played) continue;

    const teamA = await Team.findById(match.home);
    const teamB = await Team.findById(match.away);

    const result = simulateMatch(teamA, teamB);

    match.homeGoals = result.homeGoals;
    match.awayGoals = result.awayGoals;
    match.played = true;

    // Gesamtstatistik
    teamA.gamesPlayed += 1;
    teamB.gamesPlayed += 1;

    teamA.goalsFor += result.homeGoals;
    teamA.goalsAgainst += result.awayGoals;

    teamB.goalsFor += result.awayGoals;
    teamB.goalsAgainst += result.homeGoals;

    if (result.homeGoals > result.awayGoals) {
      teamA.points += 3;
      teamA.wins += 1;
      teamB.losses += 1;
    } else if (result.awayGoals > result.homeGoals) {
      teamB.points += 3;
      teamB.wins += 1;
      teamA.losses += 1;
    } else {
      teamA.points += 1;
      teamB.points += 1;
      teamA.draws += 1;
      teamB.draws += 1;
    }

    await teamA.save();
    await teamB.save();
  }

  league.currentMatchday += 1;
  await league.save();

  console.log("✅ Spieltag erfolgreich simuliert");
}

/* =========================
   SPIELTAG ABGABE (22:00)
========================= */

function matchdaySubmission() {
  console.log("📝 Spieltag-Abgabe um 22:00 erfolgt");
  // Hier könntest du später z.B. Transfers sperren etc.
}

/* =========================
   SCHEDULER START
========================= */

function startScheduler() {

  console.log("⏳ Scheduler gestartet...");

  // 🕙 Dienstag & Samstag – 22:00 Uhr
  cron.schedule("0 22 * * 2,6", matchdaySubmission, {
    timezone: "Europe/Berlin"
  });

  // 🌅 Mittwoch & Sonntag – 04:00 Uhr
  cron.schedule("0 4 * * 3,0", simulateMatchday, {
    timezone: "Europe/Berlin"
  });

}

module.exports = { startScheduler };