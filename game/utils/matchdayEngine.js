const Match = require("../models/Match");
const Season = require("../models/Season");
const Team = require("../models/Team");

const { simulateMatch } = require("./matchEngine");

async function runMatchday() {

const season = await Season.findOne();

if (!season) return;

const matchday = season.currentMatchday + 1;

const matches = await Match.find({
matchday,
played:false
});

for (const match of matches) {

const result = simulateMatch(match.homeTeam, match.awayTeam);

match.homeGoals = result.result.homeGoals;
match.awayGoals = result.result.awayGoals;

match.stats = result.stats;
match.events = result.events;

match.played = true;

await match.save();

await updateTable(match);

}

season.currentMatchday = matchday;

await season.save();

console.log("Matchday", matchday, "berechnet");

}

async function updateTable(match) {

const home = await Team.findById(match.homeTeam);
const away = await Team.findById(match.awayTeam);

home.goalsFor += match.homeGoals;
home.goalsAgainst += match.awayGoals;

away.goalsFor += match.awayGoals;
away.goalsAgainst += match.homeGoals;

home.goalDifference = home.goalsFor - home.goalsAgainst;
away.goalDifference = away.goalsFor - away.goalsAgainst;

if (match.homeGoals > match.awayGoals) {

home.points += 3;
home.wins += 1;
away.losses += 1;

} else if (match.homeGoals < match.awayGoals) {

away.points += 3;
away.wins += 1;
home.losses += 1;

} else {

home.points += 1;
away.points += 1;

home.draws += 1;
away.draws += 1;

}

await home.save();
await away.save();

}

module.exports = { runMatchday };