function applyOverloadEffect(attackingCtx, defendingCtx){

let attackBonus = 1;
let chanceBonus = 1;

/* Flügel Überladung */

const attackersWide = attackingCtx.players.filter(p =>
p.positions?.includes("LW") ||
p.positions?.includes("RW") ||
p.positions?.includes("LM") ||
p.positions?.includes("RM")
).length;

const defendersWide = defendingCtx.players.filter(p =>
p.positions?.includes("LB") ||
p.positions?.includes("RB")
).length;

if(attackersWide > defendersWide){

attackBonus *= 1.12;
chanceBonus *= 1.15;

}

/* Mittelfeld Überzahl */

const attackersMid = attackingCtx.players.filter(p =>
p.positions?.includes("CM") ||
p.positions?.includes("CDM") ||
p.positions?.includes("CAM")
).length;

const defendersMid = defendingCtx.players.filter(p =>
p.positions?.includes("CM") ||
p.positions?.includes("CDM") ||
p.positions?.includes("CAM")
).length;

if(attackersMid > defendersMid){

attackBonus *= 1.08;

}

/* Box Überzahl */

const attackersBox = attackingCtx.players.filter(p =>
p.positions?.includes("ST")
).length;

const defendersBox = defendingCtx.players.filter(p =>
p.positions?.includes("CB")
).length;

if(attackersBox > defendersBox){

chanceBonus *= 1.20;

}

return {
attackBonus,
chanceBonus
};

}

module.exports = { applyOverloadEffect };