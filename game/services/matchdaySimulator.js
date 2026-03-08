const Match = require("../models/Match");
const Team = require("../models/Team");
const Stadium = require("../models/Stadium");

const { simulateRealisticMatch } = require("../engines/simulateRealisticMatch");
const { updateMarketValues } = require("./marketValueService");
const { paySponsorWinBonus, reduceSponsorGames } = require("./sponsorService");

/* =====================================================
SIMULATE MATCHDAY
===================================================== */

async function simulateMatchday(){

const today = new Date();

const matches = await Match.find({
played:false,
date:{ $lte: today }
})
.populate("homeTeam")
.populate("awayTeam");

console.log("Spiele gefunden:", matches.length);

for(const match of matches){

/* =====================================================
MATCH SIMULATION
===================================================== */

const result = await simulateRealisticMatch({
homeTeam: match.homeTeam,
awayTeam: match.awayTeam,
match
});

match.homeGoals = result.result.homeGoals;
match.awayGoals = result.result.awayGoals;

match.stats = result.stats;
match.events = result.events;
match.ratings = result.ratings;
match.xG = result.xG;

match.played = true;

/* =====================================================
TEAM LADEN
===================================================== */

const home = await Team.findById(match.homeTeam._id);
const away = await Team.findById(match.awayTeam._id);

/* =====================================================
TABELLEN UPDATE
===================================================== */

home.played += 1;
away.played += 1;

/* Tore */

home.goalsFor += match.homeGoals;
home.goalsAgainst += match.awayGoals;

away.goalsFor += match.awayGoals;
away.goalsAgainst += match.homeGoals;

/* Torverhältnis */

home.goalDifference = home.goalsFor - home.goalsAgainst;
away.goalDifference = away.goalsFor - away.goalsAgainst;

/* Punkte */

if(match.homeGoals > match.awayGoals){

home.wins += 1;
away.losses += 1;

home.points += 3;

/* Sponsor Bonus */

await paySponsorWinBonus(home);

}
else if(match.homeGoals < match.awayGoals){

away.wins += 1;
home.losses += 1;

away.points += 3;

/* Sponsor Bonus */

await paySponsorWinBonus(away);

}
else{

home.draws += 1;
away.draws += 1;

home.points += 1;
away.points += 1;

}

/* =====================================================
ZUSCHAUER & STADION EINNAHMEN
===================================================== */

const stadium = await Stadium.findOne({
team: home._id
});

if(stadium){

const attendance = Math.floor(
stadium.capacity * (0.6 + Math.random()*0.35)
);

const revenue = attendance * stadium.ticketPrice;

home.balance += revenue;
home.lastMatchRevenue = revenue;

match.attendance = attendance;

}

/* =====================================================
SPONSOR SPIELTAG REDUZIEREN
===================================================== */

await reduceSponsorGames(home);
await reduceSponsorGames(away);

/* =====================================================
SPEICHERN
===================================================== */

await home.save();
await away.save();
await match.save();

console.log(
`${match.homeTeam.name} ${match.homeGoals}:${match.awayGoals} ${match.awayTeam.name}`
);

}

/* =====================================================
TABELLENPOSITIONEN NEU BERECHNEN
===================================================== */

await updateLeagueTables();

/* =====================================================
MARKTWERTE AKTUALISIEREN
===================================================== */

await updateMarketValues();

console.log("Matchday komplett abgeschlossen");

}

/* =====================================================
LEAGUE TABLE UPDATE
===================================================== */

async function updateLeagueTables(){

const leagues = await Team.distinct("league");

for(const league of leagues){

const teams = await Team.find({ league }).sort({

points:-1,
goalDifference:-1,
goalsFor:-1

});

for(let i=0;i<teams.length;i++){

teams[i].tablePosition = i + 1;

await teams[i].save();

}

}

}

module.exports = { simulateMatchday };