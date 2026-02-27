const cron = require("node-cron");
const { runLeagueMatchday, runCupMatchday, lockLineups } = require("./matchdayService");

// =======================
// DIENSTAG 22:00 LOCK
// =======================
cron.schedule("0 22 * * 2", async () => {
  console.log("Liga Lineups werden gelockt...");
  await lockLineups("league");
});

// =======================
// SAMSTAG 22:00 LOCK
// =======================
cron.schedule("0 22 * * 6", async () => {
  console.log("Liga Lineups werden gelockt...");
  await lockLineups("league");
});

// =======================
// MITTWOCH 04:00 SPIELTAG
// =======================
cron.schedule("0 4 * * 3", async () => {
  console.log("Liga Spieltag wird berechnet...");
  await runLeagueMatchday();
});

// =======================
// SONNTAG 04:00 SPIELTAG
// =======================
cron.schedule("0 4 * * 0", async () => {
  console.log("Liga Spieltag wird berechnet...");
  await runLeagueMatchday();
});

// =======================
// DONNERSTAG 22:00 LOCK (POKAL)
// =======================
cron.schedule("0 22 * * 4", async () => {
  console.log("Pokal Lineups werden gelockt...");
  await lockLineups("cup");
});

// =======================
// FREITAG 04:00 POKAL
// =======================
cron.schedule("0 4 * * 5", async () => {
  console.log("Pokal Spieltag wird berechnet...");
  await runCupMatchday();
});