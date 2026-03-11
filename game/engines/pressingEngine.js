function applyPressingEffect(attackingCtx, defendingCtx){

const pressing = defendingCtx.tactics?.pressing || "mittel";

let turnoverModifier = 1;
let attackModifier = 1;

switch(pressing){

case "sehr_hoch":

turnoverModifier = 1.35;
attackModifier = 0.85;

break;

case "hoch":

turnoverModifier = 1.20;
attackModifier = 0.92;

break;

case "mittel":

turnoverModifier = 1;

break;

case "low_block":

turnoverModifier = 0.75;
attackModifier = 0.85;

break;

case "tief":

turnoverModifier = 0.60;
attackModifier = 0.75;

break;

}

return {
turnoverModifier,
attackModifier
};

}

module.exports = { applyPressingEffect };