function applyGoalkeeperImpact(xG, attacker, goalkeeper){

if(!goalkeeper) return xG;

let saveModifier = 1;

/* Torwartqualität */

const gkSkill =
(goalkeeper.defending || 50) * 0.7 +
(goalkeeper.mentality || 50) * 0.3;

/* starke Torhüter */

if(gkSkill >= 90){

saveModifier -= Math.random() * 0.35;

}
else if(gkSkill >= 80){

saveModifier -= Math.random() * 0.25;

}
else if(gkSkill >= 70){

saveModifier -= Math.random() * 0.15;

}
else{

saveModifier += Math.random() * 0.10;

}

/* Big Chance Reaktionen */

if(xG > 0.40){

saveModifier -= Math.random() * 0.15;

}

/* Mindestwert */

saveModifier = Math.max(0.55, saveModifier);

return xG * saveModifier;

}

module.exports = { applyGoalkeeperImpact };