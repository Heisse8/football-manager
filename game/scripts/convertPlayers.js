const fs = require("fs");

/* ======================================================
VALID PLAYSTYLES
====================================================== */

const VALID_PLAYSTYLES = [

"sweeper_keeper",
"shot_stopper",

"ball_playing_cb",
"stopper_cb",
"interceptor_cb",

"wingback",
"inverted_fullback",
"defensive_fullback",

"anchor_man",
"deep_playmaker",
"box_to_box",
"control_cm",
"dribbling_cm",
"offensive_cm",

"playmaker_cam",
"shadow_striker",
"dribbling_cam",
"free_roamer",

"inside_forward",
"crossing_winger",
"dribble_winger",

"target_man",
"poacher",
"false_9",
"speed_striker"

];

/* ======================================================
POSITION MAP
====================================================== */

const positionMap = {

tw:"GK",
iv:"CB",
lv:"LB",
rv:"RB",

lwb:"LWB",
rwb:"RWB",

zdm:"CDM",
zm:"CM",
zom:"CAM",

lf:"LW",
rf:"RW",
st:"ST"

};

/* ======================================================
POSITION NORMALIZATION
====================================================== */

function normalizePositions(pos){

if(!pos) return ["CM"];

return pos
.toLowerCase()
.split(",")
.map(p => positionMap[p.trim()] || "CM");

}

/* ======================================================
PLAYSTYLE NORMALIZATION
====================================================== */

function normalizePlaystyles(style){

if(!style) return [];

const map = {

"speedstriker":"speed_striker",
"speed striker":"speed_striker",

"dribble_cam":"dribbling_cam",
"dribblecam":"dribbling_cam",

"shotstopper":"shot_stopper",
"shot stopper":"shot_stopper",

"targetmen":"target_man",
"target_men":"target_man",

"box2box":"box_to_box",
"box to box":"box_to_box",

"ball playing cb":"ball_playing_cb",

"mitspielender torwart":"sweeper_keeper"

};

let styles = style
.toLowerCase()
.split(",")
.map(s => s.trim().replace(/\s+/g,"_"));

styles = styles.map(s => map[s] || s);

styles = styles.filter(s => VALID_PLAYSTYLES.includes(s));

return styles;

}

/* ======================================================
NUMBER PARSER
====================================================== */

function parseNumber(v){

if(!v) return null;

return parseFloat(v.replace(",","."));

}

/* ======================================================
STAR GENERATOR
====================================================== */

function generateStars(){

return Number((1.5 + Math.random()*2.5).toFixed(1));

}

/* ======================================================
POTENTIAL GENERATOR
====================================================== */

function generatePotential(stars){

let potential = stars + Math.random()*1.5;

if(potential > 5){
potential = 5;
}

return Number(potential.toFixed(1));

}

/* ======================================================
AGE GENERATOR
====================================================== */

function generateAge(stars){

if(stars >= 4) return 26 + Math.floor(Math.random()*4);

if(stars >= 3) return 22 + Math.floor(Math.random()*6);

return 18 + Math.floor(Math.random()*8);

}

/* ======================================================
DEFAULT PLAYSTYLE
====================================================== */

function defaultPlaystyle(position){

if(position==="GK") return ["shot_stopper"];

if(position==="CB") return ["stopper_cb"];

if(position==="LB" || position==="RB" || position==="LWB" || position==="RWB")
return ["wingback"];

if(position==="CDM") return ["anchor_man"];

if(position==="CM") return ["box_to_box"];

if(position==="CAM") return ["playmaker_cam"];

if(position==="LW" || position==="RW") return ["inside_forward"];

if(position==="ST") return ["poacher"];

return ["box_to_box"];

}

/* ======================================================
LOAD FILE
====================================================== */

const text = fs.readFileSync("./data/players.txt","utf8");

const lines = text.split("\n");

const players = [];

/* ======================================================
PARSER
====================================================== */

for(const line of lines){

if(!line.trim()) continue;

const parts = line.split("\t");

const name = parts[0]?.trim();

if(!name) continue;

const nameParts = name.split(" ");

const firstName = nameParts[0];

let lastName = nameParts.slice(1).join(" ");

if(!lastName || lastName.trim() === ""){
lastName = firstName;
}

/* STARS */

let stars = parseNumber(parts[1]);

if(!stars) stars = generateStars();

/* POTENTIAL */

let potential = parseNumber(parts[2]);

if(!potential) potential = generatePotential(stars);

/* POSITIONS */

const positions = normalizePositions(parts[3]);

/* PLAYSTYLES */

let playstyles = normalizePlaystyles(parts[4]);

if(playstyles.length === 0){

playstyles = defaultPlaystyle(positions[0]);

}

/* CREATE PLAYER */

players.push({

firstName,
lastName,

nationality:"Germany",

age: generateAge(stars),

stars,
potential,

positions,
playstyles,

fitness: 90 + Math.floor(Math.random()*10),

form: Number((6 + Math.random()*2).toFixed(2)),

value: Math.round(stars * 1200000)

});

}

/* ======================================================
SAVE JSON
====================================================== */

fs.writeFileSync(

"./data/bundesligaPlayers.json",
JSON.stringify(players,null,2)

);

console.log("Spieler erstellt:",players.length);