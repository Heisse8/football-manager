function calculatePositionScore(player, position){

let score = 0;

/* Grundattribute */

score += (player.pace || 50) * 0.2;
score += (player.passing || 50) * 0.2;
score += (player.physical || 50) * 0.2;
score += (player.mentality || 50) * 0.2;
score += (player.fitness || 100) * 0.2;

/* Positionsbonus */

switch(position){

case "ST":

score += (player.shooting || 50) * 0.6;

if(player.playStyle === "finisher") score *= 1.2;
if(player.playStyle === "targetman") score *= 1.1;

break;

case "LW":
case "RW":

score += (player.pace || 50) * 0.5;
score += (player.shooting || 50) * 0.2;

if(player.playStyle === "winger") score *= 1.2;

break;

case "CAM":

score += (player.passing || 50) * 0.6;

if(player.playStyle === "playmaker") score *= 1.3;

break;

case "CM":

score += (player.passing || 50) * 0.3;
score += (player.physical || 50) * 0.3;

if(player.playStyle === "box_to_box") score *= 1.15;

break;

case "CDM":

score += (player.defending || 50) * 0.6;

if(player.playStyle === "ball_winner") score *= 1.25;

break;

case "CB":

score += (player.defending || 50) * 0.7;
score += (player.physical || 50) * 0.3;

break;

case "LB":
case "RB":

score += (player.pace || 50) * 0.4;
score += (player.defending || 50) * 0.3;

break;

case "GK":

score += (player.defending || 50) * 0.6;
score += (player.mentality || 50) * 0.4;

if(player.playStyle === "sweeper_keeper") score *= 1.1;

break;

}

return score;

}

module.exports = { calculatePositionScore };