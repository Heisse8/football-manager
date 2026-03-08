function generateSponsors(team){

const fanBase = team.fanBase || 1;
const lastPosition = team.lastSeasonPosition || 10;
const leagueLevel = team.leagueLevel || 1;

/* Basiswert */

let base =
fanBase *
25000 *
(1 + (leagueLevel * 0.15));

/* Tabellenplatz Einfluss */

const positionFactor =
1 + ((18 - lastPosition) * 0.04);

base *= positionFactor;

/* ================= ANGEBOTE ================= */

return [

/* ================= SICHER ================= */

{
type:"safe",

name:"Regionaler Sponsor",

payment: Math.round(base * 0.9),

seasonBonus:null,

winBonus:0

},

/* ================= AUSGEWOGEN ================= */

{
type:"balanced",

name:"Nationaler Sponsor",

payment: Math.round(base * 0.7),

seasonBonus:{
top10: Math.round(base * 4),
top5: Math.round(base * 8)
},

winBonus:0

},

/* ================= RISIKO ================= */

{
type:"risky",

name:"Global Brand",

payment: Math.round(base * 0.4),

seasonBonus:{
top3: Math.round(base * 12),
champion: Math.round(base * 20)
},

winBonus: Math.round(base * 0.6)

}

];

}

module.exports = { generateSponsors };