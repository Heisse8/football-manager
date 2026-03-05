const Match = require("../models/Match");

/* =====================================================
 SPIELPLAN GENERATOR
===================================================== */

function shuffle(array) {

for (let i = array.length - 1; i > 0; i--) {

const j = Math.floor(Math.random() * (i + 1));

[array[i], array[j]] = [array[j], array[i]];

}

return array;

}

/* =====================================================
 ROUND ROBIN SYSTEM
===================================================== */

function generateRoundRobin(teams) {

const teamIds = teams.map(t => t._id);

shuffle(teamIds);

const rounds = [];
const teamCount = teamIds.length;

for (let round = 0; round < teamCount - 1; round++) {

const matches = [];

for (let i = 0; i < teamCount / 2; i++) {

const home = teamIds[i];
const away = teamIds[teamCount - 1 - i];

matches.push({ home, away });

}

rounds.push(matches);

// rotation

teamIds.splice(1, 0, teamIds.pop());

}

return rounds;

}

/* =====================================================
 SPIELDATUM GENERATOR
===================================================== */

function generateMatchDate(startDate, matchday) {

const base = new Date(startDate);

const weeks = Math.floor(matchday / 2);

const isTuesday = matchday % 2 === 0;

base.setDate(base.getDate() + weeks * 7);

if (isTuesday) {

base.setDate(base.getDate() + 2);

} else {

base.setDate(base.getDate() + 6);

}

base.setHours(4,0,0,0);

return base;

}

/* =====================================================
 HAUPTFUNKTION
===================================================== */

async function generateLeagueSchedule(teams, league) {

if (teams.length !== 18) {

throw new Error("Liga braucht genau 18 Teams");

}

const firstRound = generateRoundRobin(teams);
const secondRound = firstRound.map(round =>
round.map(match => ({
home: match.away,
away: match.home
}))
);

const allRounds = [...firstRound, ...secondRound];

const startDate = new Date();

let matchday = 0;

for (const round of allRounds) {

const date = generateMatchDate(startDate, matchday);

for (const match of round) {

await Match.create({

league,

homeTeam: match.home,
awayTeam: match.away,

date,

matchday: matchday + 1,

played: false

});

}

matchday++;

}

}

module.exports = {
generateLeagueSchedule
};