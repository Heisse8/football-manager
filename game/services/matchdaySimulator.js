const Match = require("../models/Match");
const Team = require("../models/Team");

const { simulateRealisticMatch } = require("../engines/matchEngine");
const { updateLeagueTable } = require("../utils/updateLeagueTable");
const { updateScorers } = require("../utils/updateLeagueTable");

async function simulateMatchday(){

/* =====================================================
ALLE SPIELE DIE NOCH NICHT GESPIELT WURDEN
===================================================== */

const matches = await Match.find({
competition:"league",
played:false
})
.populate("homeTeam")
.populate("awayTeam")
.sort({ date:1 });

for(const match of matches){

await simulateSingleMatch(match);

}

}

module.exports = { simulateMatchday };



/* =====================================================
EIN SPIEL SIMULIEREN
===================================================== */

async function simulateSingleMatch(match){

const homeTeam = match.homeTeam;
const awayTeam = match.awayTeam;

/* =====================================================
MATCH ENGINE
===================================================== */

const simulation = await simulateRealisticMatch({
homeTeam,
awayTeam
});

/* =====================================================
ERGEBNIS SPEICHERN
===================================================== */

match.homeGoals = simulation.homeGoals;
match.awayGoals = simulation.awayGoals;

match.stats = simulation.stats;
match.xG = simulation.xG;
match.possession = simulation.possession;

match.played = true;
match.status = "finished";

await match.save();

/* =====================================================
TABELLE UPDATEN
===================================================== */

await updateLeagueTable(match);

/* =====================================================
SCORER UPDATEN
===================================================== */

await updateScorers(match);

}