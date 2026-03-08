const Season = require("../../models/Season");

async function initializeSeason() {

const existingSeason = await Season.findOne();

if (existingSeason) return;

const start = new Date();

const end = new Date();

end.setDate(start.getDate() + 120);

await Season.create({

seasonNumber: 1,

seasonStart: start,

seasonEnd: end,

currentMatchday: 0,

status: "running"

});

console.log("Season 1 erstellt");

}

module.exports = { initializeSeason };
