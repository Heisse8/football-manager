function applyBigChance(state, attacker, goalkeeper){

let bigChance = false;

/* Basis Wahrscheinlichkeit */

let chance = 0.08;

/* gute Stürmer erzeugen mehr Big Chances */

if(attacker.shooting >= 85) chance += 0.06;
if(attacker.pace >= 85) chance += 0.04;

/* schwacher Torwart */

if((goalkeeper?.defending || 50) < 70) chance += 0.05;

/* zufälliger Faktor */

if(Math.random() < chance){

bigChance = true;

}

return bigChance;

}

module.exports = { applyBigChance };