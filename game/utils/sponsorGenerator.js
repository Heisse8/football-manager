function generateSponsors(team){

const reputation = team.sponsorReputation || 1;
const fanBase = team.fanBase || 1;
const leagueLevel = team.leagueLevel || 1;

let base =
fanBase *
25000 *
reputation *
(1 + leagueLevel * 0.15);

/* ================= ANGEBOTE ================= */

return [

/* ================= SICHER ================= */

{
name:"Regionaler Sponsor",

payment: Math.round(base * 0.9),

winBonus:0,

seasonBonus:null
},

/* ================= BALANCED ================= */

{
name:"Nationaler Sponsor",

payment: Math.round(base * 0.7),

winBonus:0,

seasonBonus:{
top10: Math.round(base * 4),
top5: Math.round(base * 8)
}
},

/* ================= RISIKO ================= */

{
name:"Global Brand",

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