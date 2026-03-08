function generateSponsors(team){

const fanBase = team.fanBase || 1;

const base = 20000 * fanBase;

return [

{
name:"Local Partner",
payment: Math.round(base * 0.8),
duration:10
},

{
name:"Regional Sponsor",
payment: Math.round(base * 1.4),
duration:10
},

{
name:"Global Brand",
payment: Math.round(base * 2.2),
duration:10
}

];

}

module.exports = { generateSponsors };