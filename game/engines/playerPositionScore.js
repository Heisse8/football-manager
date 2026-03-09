function calculatePositionScore(player, position){

const pace = player.pace ?? 50;
const passing = player.passing ?? 50;
const shooting = player.shooting ?? 50;
const defending = player.defending ?? 50;
const physical = player.physical ?? 50;
const mentality = player.mentality ?? 50;
const fitness = player.fitness ?? 100;

let score = 0;

/* =====================================================
GRUNDATTRIBUTE
===================================================== */

score += pace * 0.15;
score += passing * 0.15;
score += physical * 0.15;
score += mentality * 0.15;
score += fitness * 0.10;

/* =====================================================
POSITIONSMATCH BONUS
===================================================== */

if(player.positions && player.positions.includes(position)){
score *= 1.15;
}

/* =====================================================
POSITIONSSPEZIFISCHE ATTRIBUTE
===================================================== */

switch(position){

case "ST":

score += shooting * 0.7;
score += pace * 0.2;

if(player.playStyle === "finisher") score *= 1.2;
if(player.playStyle === "targetman") score *= 1.1;

break;


case "LW":
case "RW":

score += pace * 0.6;
score += shooting * 0.2;
score += passing * 0.2;

if(player.playStyle === "winger") score *= 1.2;

break;


case "CAM":

score += passing * 0.7;
score += mentality * 0.2;

if(player.playStyle === "playmaker") score *= 1.3;

break;


case "CM":

score += passing * 0.4;
score += physical * 0.3;
score += mentality * 0.2;

if(player.playStyle === "box_to_box") score *= 1.15;

break;


case "CDM":

score += defending * 0.6;
score += physical * 0.2;
score += mentality * 0.2;

if(player.playStyle === "ball_winner") score *= 1.25;

break;


case "CB":

score += defending * 0.7;
score += physical * 0.3;

if(player.playStyle === "defensive_wall") score *= 1.15;

break;


case "LB":
case "RB":

score += pace * 0.4;
score += defending * 0.3;
score += passing * 0.2;

break;


case "GK":

score += defending * 0.6;
score += mentality * 0.3;

if(player.playStyle === "sweeper_keeper") score *= 1.1;

break;

}

/* =====================================================
ALTERSFAKTOR
===================================================== */

if(player.age){

if(player.age < 21) score *= 0.95;
if(player.age > 32) score *= 0.92;

}

/* =====================================================
MORALE BONUS
===================================================== */

if(player.morale){

score *= 1 + ((player.morale - 50) / 500);

}

return Math.round(score);

}

module.exports = { calculatePositionScore };