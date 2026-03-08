const Team = require("../models/Team");

const leagues = [

"GER-1",
"GER-2",

"ENG-1",
"ENG-2",

"ESP-1",
"ESP-2",

"ITA-1",
"ITA-2",

"FRA-1",
"FRA-2"

];

async function getNextLeague(){

for(const league of leagues){

const teams = await Team.countDocuments({ league });

if(teams < 18){
return league;
}

}

throw new Error("Alle Ligen sind voll");

}

module.exports = { getNextLeague };