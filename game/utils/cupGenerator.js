const Match = require("../models/Match");

/* =====================================================
SHUFFLE (FISHER-YATES)
===================================================== */

function shuffle(arr){

const array = [...arr];

for(let i = array.length - 1; i > 0; i--){

const j = Math.floor(Math.random() * (i + 1));

[array[i], array[j]] = [array[j], array[i]];

}

return array;

}

/* =====================================================
POKAL RUNDE GENERIEREN
===================================================== */

async function generateCupRound(teams, country, round, date){

const shuffled = shuffle(teams);

/* ungerade Teams → Freilos */

if(shuffled.length % 2 !== 0){

const byeTeam = shuffled.pop();

console.log(`Freilos für ${byeTeam.name}`);

await Match.create({

homeTeam: byeTeam._id,
awayTeam: null,

competition:"cup",
country,

round,

date:null,
played:true

});

}

/* Matches erstellen */

for(let i = 0; i < shuffled.length; i += 2){

await Match.create({

homeTeam: shuffled[i]._id,
awayTeam: shuffled[i+1]._id,

competition:"cup",
country,

round,

date,
played:false

});

}

console.log(`Cup Runde erstellt: ${round}`);

}

module.exports = { generateCupRound };