function applySpaceCreation(attackCtx, defendCtx){

let spaceBonus = 1;

/* ======================================================
 FALSE 9 – zieht Innenverteidiger raus
====================================================== */

const falseNine = attackCtx.players.find(p =>
p.playstyles?.includes("false_9")
);

if(falseNine){

const defenders = defendCtx.players.filter(p =>
p.positions?.includes("CB")
);

if(defenders.length >= 2){

spaceBonus *= 1.08;

}

}

/* ======================================================
 WINGER BREITE
====================================================== */

const wingers = attackCtx.players.filter(p =>
p.positions?.includes("LW") ||
p.positions?.includes("RW")
);

if(wingers.length >= 2){

spaceBonus *= 1.05;

}

/* ======================================================
 OVERLAPPING FULLBACK
====================================================== */

const wingbacks = attackCtx.players.filter(p =>
p.playstyles?.includes("wingback")
);

if(wingbacks.length >= 1){

spaceBonus *= 1.04;

}

/* ======================================================
 HALBRAUMSPIELER
====================================================== */

const halfspacePlayers = attackCtx.players.filter(p =>
p.playstyles?.includes("halfspace_creator")
);

if(halfspacePlayers.length){

spaceBonus *= 1.05;

}

return {

spaceBonus

};

}

module.exports = { applySpaceCreation };