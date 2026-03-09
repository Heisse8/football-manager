const cron = require("node-cron");

const {
runLeagueMatchday,
runCupMatchday,
lockLineups
} = require("./matchdayService");

const options = {
timezone: "Europe/Berlin"
};

/* =====================================================
DIENSTAG 22:00
LINEUPS LOCKEN (LIGA)
===================================================== */

cron.schedule("0 22 * * 2", async () => {

console.log("🔒 Liga Lineups werden gelockt...");

try{
await lockLineups("league");
}catch(err){
console.error("Fehler beim Locken der Lineups:", err);
}

}, options);

/* =====================================================
SAMSTAG 22:00
LINEUPS LOCKEN (LIGA)
===================================================== */

cron.schedule("0 22 * * 6", async () => {

console.log("🔒 Liga Lineups werden gelockt...");

try{
await lockLineups("league");
}catch(err){
console.error("Fehler beim Locken der Lineups:", err);
}

}, options);

/* =====================================================
MITTWOCH 04:00
LIGA SPIELTAG
===================================================== */

cron.schedule("0 4 * * 3", async () => {

console.log("⚽ Liga Spieltag wird berechnet...");

try{
await runLeagueMatchday();
}catch(err){
console.error("Liga Matchday Fehler:", err);
}

}, options);

/* =====================================================
SONNTAG 04:00
LIGA SPIELTAG
===================================================== */

cron.schedule("0 4 * * 0", async () => {

console.log("⚽ Liga Spieltag wird berechnet...");

try{
await runLeagueMatchday();
}catch(err){
console.error("Liga Matchday Fehler:", err);
}

}, options);

/* =====================================================
DONNERSTAG 22:00
LINEUPS LOCKEN (POKAL)
===================================================== */

cron.schedule("0 22 * * 4", async () => {

console.log("🔒 Pokal Lineups werden gelockt...");

try{
await lockLineups("cup");
}catch(err){
console.error("Pokal Lock Fehler:", err);
}

}, options);

/* =====================================================
FREITAG 04:00
POKAL SPIELTAG
===================================================== */

cron.schedule("0 4 * * 5", async () => {

console.log("🏆 Pokal Spieltag wird berechnet...");

try{
await runCupMatchday();
}catch(err){
console.error("Pokal Matchday Fehler:", err);
}

}, options);