const { philosophyFormations } = require("./trainerFormations");

function selectTrainerFormation(players, philosophy){

const possible = philosophyFormations[philosophy] || ["4-3-3"];

let bestFormation = possible[0];
let bestScore = -999;

/* jede Formation testen */

possible.forEach(formation=>{

const score = evaluateFormation(players, formation);

if(score > bestScore){

bestScore = score;
bestFormation = formation;

}

});

return bestFormation;

}

/* ============================================ */
/* Formation Score berechnen */
/* ============================================ */

function evaluateFormation(players, formation){

let score = 0;

players.forEach(p=>{

const pos = p.positions || [];

/* einfache Bewertung */

if(pos.includes("ST")) score += 3;
if(pos.includes("LW") || pos.includes("RW")) score += 2;
if(pos.includes("CM") || pos.includes("CDM")) score += 2;
if(pos.includes("CB")) score += 2;

score += (p.stars || 0);

});

/* leichte Varianz */

score += Math.random()*2;

return score;

}

module.exports = { selectTrainerFormation };