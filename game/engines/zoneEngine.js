function determineZoneProgress(attackingCtx, defendingCtx){

let progressChance = 0.55;

/* Ballbesitz Teams kommen leichter nach vorne */

progressChance += (attackingCtx.possessionSkill - defendingCtx.possessionSkill) * 0.002;

/* Pressing beeinflusst Aufbau */

const pressing = defendingCtx.tactics?.pressing || "mittel";

if(pressing === "sehr_hoch") progressChance -= 0.08;
if(pressing === "hoch") progressChance -= 0.05;
if(pressing === "low_block") progressChance += 0.05;

/* Tempo beeinflusst Risiko */

const tempo = attackingCtx.tactics?.tempo || "kontrolliert";

if(tempo === "sehr_hoch") progressChance += 0.05;
if(tempo === "langsam") progressChance -= 0.05;

return Math.random() < progressChance;

}

module.exports = { determineZoneProgress };