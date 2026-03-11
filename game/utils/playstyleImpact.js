function applyPlaystyleImpact(player, context){

if(!player.playstyles) return context;

for(const style of player.playstyles){

switch(style){

/* STRIKER */

case "poacher":
context.shotBonus += 0.08;
break;

case "target_man":
context.physicalBonus += 0.06;
break;

case "speed_striker":
context.paceBonus += 0.10;
break;

/* WINGER */

case "inside_forward":
context.shotBonus += 0.05;
break;

case "crossing_winger":
context.crossBonus += 0.10;
break;

case "dribble_winger":
context.dribbleBonus += 0.12;
break;

/* CAM */

case "playmaker_cam":
context.keyPassBonus += 0.15;
break;

case "shadow_striker":
context.shotBonus += 0.07;
break;

case "free_roamer":
context.dribbleBonus += 0.06;
context.keyPassBonus += 0.06;
break;

/* MIDFIELD */

case "box_to_box":
context.staminaBonus += 0.05;
break;

case "control_cm":
context.keyPassBonus += 0.05;
break;

case "dribbling_cm":
context.dribbleBonus += 0.07;
break;

case "offensive_cm":
context.shotBonus += 0.05;
break;

/* DEF */

case "ball_playing_cb":
context.keyPassBonus += 0.05;
break;

case "stopper_cb":
context.defenseBonus += 0.07;
break;

case "interceptor_cb":
context.defenseBonus += 0.08;
break;

/* FULLBACK */

case "wingback":
context.crossBonus += 0.08;
break;

case "inverted_fullback":
context.keyPassBonus += 0.05;
break;

case "defensive_fullback":
context.defenseBonus += 0.06;
break;

}

}

return context;

}

module.exports = { applyPlaystyleImpact };