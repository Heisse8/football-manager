function applyFinishingVariance(xG, attacker){

let variance = 1;

/* Spielerqualität */

if(attacker.stars >= 5){

variance += (Math.random() * 0.25) - 0.05;

}else if(attacker.stars >= 4){

variance += (Math.random() * 0.30) - 0.10;

}else{

variance += (Math.random() * 0.35) - 0.15;

}

/* Finishing Skill */

const finishing = attacker.shooting || 50;

if(finishing >= 85){

variance += Math.random() * 0.15;

}

if(finishing <= 60){

variance -= Math.random() * 0.20;

}

/* Chaos Faktor */

variance += (Math.random() * 0.20) - 0.10;

return Math.max(0.05, xG * variance);

}

module.exports = { applyFinishingVariance };