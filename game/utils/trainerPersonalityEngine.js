function applyTrainerPersonality(ctx, coach){

if(!coach) return;

switch(coach.personality){

/* =====================================================
POSSESSION MASTER (Guardiola / De Zerbi)
===================================================== */

case "possession_master":

ctx.possessionSkill *= 1.20;
ctx.attackStrength *= 1.05;
ctx.buildUpSpeed = 0.9;

break;


/* =====================================================
GEGENPRESS MONSTER (Klopp)
===================================================== */

case "gegenpress_monster":

ctx.attackStrength *= 1.10;
ctx.defenseStrength *= 1.05;

ctx.pressIntensity = 1.3;
ctx.turnoverCreation = 1.25;

break;


/* =====================================================
DEFENSIVE WALL (Simeone)
===================================================== */

case "defensive_wall":

ctx.defenseStrength *= 1.20;
ctx.attackStrength *= 0.92;

ctx.blockBonus = 1.3;

break;


/* =====================================================
TACTICAL GENIUS (Nagelsmann)
===================================================== */

case "tactical_genius":

ctx.adaptationBonus = 1.25;
ctx.attackStrength *= 1.05;
ctx.defenseStrength *= 1.05;

break;


/* =====================================================
DIRECT PLAY (Mourinho)
===================================================== */

case "direct_play":

ctx.attackStrength *= 1.08;
ctx.possessionSkill *= 0.9;

ctx.counterBonus = 1.25;

break;


/* =====================================================
DEFAULT
===================================================== */

default:

break;

}

}

module.exports = { applyTrainerPersonality };