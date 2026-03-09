function generateSponsors(team){

const reputation = team.sponsorReputation || 1;
const fanBase = team.fanBase || 1;

/* Liga Level automatisch bestimmen */

const leagueLevel =
team.league && team.league.endsWith("_1") ? 2 : 1;

/* Basiswert */

let base =
fanBase *
12000 *
reputation *
(1 + leagueLevel * 0.15);

/* Sponsor Namen */

const regionalNames = [
"Autohaus Müller",
"Stadtwerke",
"Sparkasse",
"Brauer & Sohn"
];

const nationalNames = [
"TeleCom AG",
"NordBank",
"SportFit",
"MediaTech"
];

const globalNames = [
"Adreno",
"HyperEnergy",
"NovaTech",
"SkyLink"
];

function random(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

/* Angebote */

return [

{
name: random(regionalNames),

payment: Math.round(base * 0.9),

winBonus:0,

seasonBonus:null
},

{
name: random(nationalNames),

payment: Math.round(base * 0.7),

winBonus:0,

seasonBonus:{
top10: Math.round(base * 4),
top5: Math.round(base * 8)
}
},

{
name: random(globalNames),

payment: Math.round(base * 0.4),

winBonus: Math.round(base * 0.5),

seasonBonus:{
top3: Math.round(base * 12),
champion: Math.round(base * 20)
}
}

];

}

module.exports = { generateSponsors };