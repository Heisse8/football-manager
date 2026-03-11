function getRoleWeights(player){

let weights = {
shoot:1,
pass:1,
dribble:1,
cross:1
};

/* STRIKER */

if(player.positions?.includes("ST")){
weights.shoot = 6;
weights.pass = 2;
}

/* CAM */

if(player.positions?.includes("CAM")){
weights.pass = 5;
weights.dribble = 4;
}

/* WINGER */

if(player.positions?.includes("LW") || player.positions?.includes("RW")){
weights.dribble = 5;
weights.cross = 4;
weights.shoot = 3;
}

/* CM */

if(player.positions?.includes("CM")){
weights.pass = 4;
weights.shoot = 2;
}

/* CDM */

if(player.positions?.includes("CDM")){
weights.pass = 3;
weights.shoot = 1;
}

/* DEFENDER */

if(player.positions?.includes("CB")){
weights.shoot = 0.5;
weights.pass = 2;
}

/* PLAYSTYLE BOOST */

if(player.playstyles?.includes("playmaker_cam"))
weights.pass += 3;

if(player.playstyles?.includes("dribble_winger"))
weights.dribble += 3;

if(player.playstyles?.includes("crossing_winger"))
weights.cross += 3;

if(player.playstyles?.includes("poacher"))
weights.shoot += 4;

return weights;

}

module.exports = { getRoleWeights };