const Team = require("../models/Team");

/* =====================================================
 LIGAREIHENFOLGE
===================================================== */

const leagueOrder = [

"GER_1",
"GER_2",

"ENG_1",
"ENG_2",

"ESP_1",
"ESP_2",

"ITA_1",
"ITA_2",

"FRA_1",
"FRA_2"

];

const MAX_TEAMS_PER_LEAGUE = 18;

/* =====================================================
 FINDE NÄCHSTE LIGA
===================================================== */

async function getNextLeague() {

for (const league of leagueOrder) {

const count = await Team.countDocuments({ league });

if (count < MAX_TEAMS_PER_LEAGUE) {

return league;

}

}

throw new Error("Alle Ligen sind voll");

}

module.exports = {
getNextLeague
};