const Team = require("../models/Team");

const leagues = [

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

async function getNextLeague(){

/* Teams pro Liga zählen */

const counts = await Team.aggregate([
{
$group:{
_id:"$league",
count:{ $sum:1 }
}
}
]);

const map = {};

counts.forEach(c=>{
map[c._id] = c.count;
});

/* nächste Liga suchen */

for(const league of leagues){

const count = map[league] || 0;

if(count < 18){
return league;
}

}

throw new Error("Alle Ligen sind voll");

}

module.exports = { getNextLeague };