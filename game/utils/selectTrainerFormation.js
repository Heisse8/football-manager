const { philosophyFormations } = require("./trainerFormations");

function selectTrainerFormation(players, philosophy){

const possible = philosophyFormations[philosophy] || ["4-3-3"];

let bestFormation = possible[0];
let bestScore = -999;

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

const [def, mid, att] = formation.split("-").map(Number);

let defenders = 0;
let midfielders = 0;
let attackers = 0;

players.forEach(p=>{

const pos = p.positions || [];

if(pos.includes("CB") || pos.includes("LB") || pos.includes("RB")){
defenders++;
}

if(pos.includes("CM") || pos.includes("CDM") || pos.includes("CAM")){
midfielders++;
}

if(pos.includes("ST") || pos.includes("LW") || pos.includes("RW")){
attackers++;
}

});

/* Formation Fit */

let score = 0;

score -= Math.abs(defenders - def) * 2;
score -= Math.abs(midfielders - mid) * 2;
score -= Math.abs(attackers - att) * 2;

/* Spielerqualität */

players.forEach(p=>{
score += p.stars || 0;
});

/* leichte Varianz */

score += Math.random()*2;

return score;

}

module.exports = { selectTrainerFormation };