function applyDefensiveShape(ctx){

const shape = ctx.tactic?.pressing || "mittel";

let modifiers = {

progressModifier: 1,
shotSuppression: 1,
turnoverModifier: 1

};

/* ======================================================
 HIGH PRESS
====================================================== */

if(shape === "sehr_hoch" || shape === "hoch"){

modifiers.progressModifier = 0.92;
modifiers.shotSuppression = 0.95;
modifiers.turnoverModifier = 1.15;

}

/* ======================================================
 MID BLOCK
====================================================== */

if(shape === "mittel"){

modifiers.progressModifier = 1;
modifiers.shotSuppression = 1;
modifiers.turnoverModifier = 1;

}

/* ======================================================
 LOW BLOCK
====================================================== */

if(shape === "low_block" || shape === "tief"){

modifiers.progressModifier = 1.05;
modifiers.shotSuppression = 0.85;
modifiers.turnoverModifier = 0.95;

}

return modifiers;

}

module.exports = { applyDefensiveShape };