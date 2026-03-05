const cron = require("node-cron");

const { simulateMatchday } = require("../services/matchdaySimulator");

cron.schedule("0 4 * * *", async () => {

console.log("🕓 04:00 Spieltag Simulation startet");

await simulateMatchday();

});