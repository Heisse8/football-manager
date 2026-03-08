const Team = require("../models/Team");

async function updateSponsorReputation(team){

let rep = team.sponsorReputation || 1;

const position = team.tablePosition;

/* ================= ERFOLG ================= */

if(position === 1){

rep += 0.4;

}

else if(position <= 3){

rep += 0.25;

}

else if(position <= 5){

rep += 0.15;

}

else if(position <= 10){

rep += 0.05;

}

/* ================= SCHLECHTE SAISON ================= */

else if(position >= 16){

rep -= 0.2;

}

/* Begrenzen */

rep = Math.max(0.6, Math.min(3, rep));

team.sponsorReputation = rep;

team.lastSeasonPosition = position;

await team.save();

}

module.exports = { updateSponsorReputation };