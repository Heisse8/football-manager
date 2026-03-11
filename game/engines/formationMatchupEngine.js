function applyFormationMatchup(homeCtx, awayCtx){

const home = homeCtx.formation || "442";
const away = awayCtx.formation || "442";

let homeBonus = {
attack:1,
defense:1,
possession:1
};

let awayBonus = {
attack:1,
defense:1,
possession:1
};

/* ======================================================
433 vs 4231
====================================================== */

if(home==="433" && away==="4231"){

homeBonus.possession = 1.08;

}

if(home==="4231" && away==="433"){

awayBonus.possession = 1.08;

}

/* ======================================================
352 vs 433
====================================================== */

if(home==="352" && away==="433"){

awayBonus.attack = 1.12;

}

if(home==="433" && away==="352"){

homeBonus.attack = 1.12;

}

/* ======================================================
442 vs 4231
====================================================== */

if(home==="442" && away==="4231"){

awayBonus.possession = 1.10;

}

if(home==="4231" && away==="442"){

homeBonus.possession = 1.10;

}

/* ======================================================
343 vs 442
====================================================== */

if(home==="343" && away==="442"){

homeBonus.attack = 1.10;

}

if(home==="442" && away==="343"){

awayBonus.attack = 1.10;

}

applyBonus(homeCtx,homeBonus);
applyBonus(awayCtx,awayBonus);

}

function applyBonus(ctx,bonus){

ctx.attackStrength *= bonus.attack;
ctx.defenseStrength *= bonus.defense;
ctx.possessionSkill *= bonus.possession;

}

module.exports = { applyFormationMatchup };