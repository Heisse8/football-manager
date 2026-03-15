const { getFormationSlots } = require("./formationSlots");
const { calculatePositionScore } = require("./playerPositionScore");
const { calculateRoleFit } = require("../engines/trainerRoleFitEngine");
const { chooseFormation } =
require("../engines/trainerFormationEngine");

function generateLineup(team, trainer){

const players = [...(team.players || [])];

if(players.length === 0){
return { formation:"4-4-2", lineup:{}, bench:[] };
}

const formation = chooseFormation(team, trainer)
const slots = getFormationSlots(formation);

const usedPlayers = new Set();
const lineup = {};

/* ======================================================
 ROTATION INTENSITÄT
====================================================== */

const rotationFactor = getRotationFactor(trainer);

/* ======================================================
 TRAINER STIL GEWICHTE
====================================================== */

const styleWeights = getStyleWeights(trainer?.philosophy);

/* ======================================================
 ROLLEN PREFERENZEN
====================================================== */

const rolePrefs = getRolePreferences(trainer?.philosophy);

/* ======================================================
 TORWART
====================================================== */

const goalkeeper = players
.filter(p => p.positions?.includes("GK"))
.sort((a,b)=> (b.rating || 60) - (a.rating || 60))[0];

if(goalkeeper){

lineup["GK"] = goalkeeper._id;
usedPlayers.add(goalkeeper._id);

}

/* ======================================================
 RESTLICHE POSITIONEN
====================================================== */

slots.forEach(position => {

if(position === "GK") return;

let bestPlayer = null;
let bestScore = -Infinity;

for(const player of players){

if(usedPlayers.has(player._id)) continue;

/* ======================================================
 POSITION MUSS IM PROFIL DES SPIELERS SEIN
====================================================== */

if(!player.positions || !player.positions.includes(position)){
continue;
}

/* ======================================================
 FITNESS
====================================================== */

const fitnessModifier = (player.fitness ?? 100) / 100;

/* ======================================================
 ROTATION
====================================================== */

const rotationPenalty =
player.lastMatchStarted ? (1 - rotationFactor) : 1;

/* ======================================================
 POSITIONS FIT
====================================================== */

const baseScore = calculatePositionScore(player, position);

/* ======================================================
 TRAINER ROLE FIT
====================================================== */

const roleFit = calculateRoleFit(player, trainer);

/* ======================================================
 SPIELER QUALITÄT (WICHTIGSTER FAKTOR)
====================================================== */

const rating = player.rating || 60;

/* ======================================================
 QUALITÄT SCORE
====================================================== */

let qualityScore = rating * 2;

/* ======================================================
 STAR PRIORITY
====================================================== */

if(rating >= 95){
qualityScore *= 1.35;
}
else if(rating >= 92){
qualityScore *= 1.25;
}
else if(rating >= 88){
qualityScore *= 1.15;
}


/* ======================================================
 STIL SCORE
====================================================== */

const styleScore =
(player.passing || 50) * (styleWeights.passing || 1) +
(player.dribbling || 50) * (styleWeights.dribbling || 1) +
(player.pace || 50) * (styleWeights.pace || 1) +
(player.defending || 50) * (styleWeights.defending || 1) +
(player.mentality || 50) * (styleWeights.mentality || 1);

const styleModifier = styleScore / 250;

/* ======================================================
 ROLLEN BONUS
====================================================== */

let roleModifier = 1;

if(player.playstyles){

for(const role of player.playstyles){

if(rolePrefs[role]){
roleModifier += rolePrefs[role] * 0.05;
}

}

}

/* ======================================================
 GESAMT SCORE
====================================================== */

let score =
qualityScore *
baseScore *
fitnessModifier *
rotationPenalty *
roleFit *
(1 + styleModifier) *
roleModifier;

/* ======================================================
 TRAINER QUALITÄT
====================================================== */

if(trainer?.stars){
score *= (0.9 + trainer.stars * 0.05);
}

if(score > bestScore){

bestScore = score;
bestPlayer = player;

}

}

if(bestPlayer){

lineup[position] = bestPlayer._id;
usedPlayers.add(bestPlayer._id);

}

});

/* ======================================================
 FALLBACK
====================================================== */

if(Object.keys(lineup).length < slots.length){

for(const player of players){

if(usedPlayers.has(player._id)) continue;

const emptySlot = slots.find(
s => !lineup[s] && player.positions?.includes(s)
);


if(!emptySlot) break;

lineup[emptySlot] = player._id;
usedPlayers.add(player._id);

}

}

/* ======================================================
 BANK
====================================================== */

const bench = generateBench(players, usedPlayers);

/* ======================================================
 RESULT
====================================================== */

return {

formation,
lineup,
bench

};

}

module.exports = { generateLineup };

/* ======================================================
 ROTATION LOGIK
====================================================== */

function getRotationFactor(trainer){

if(!trainer) return 0.1;

const stars = trainer.stars || 2;

switch(stars){

case 5: return 0.35;
case 4.5: return 0.32;
case 4: return 0.30;
case 3.5: return 0.25;
case 3: return 0.22;
case 2.5: return 0.18;
case 2: return 0.15;

default:
return 0.1;

}

}

/* ======================================================
 TRAINER STIL GEWICHTE
====================================================== */

function getStyleWeights(style){

switch(style){

case "ballbesitz":
return {
passing:1.4,
dribbling:1.2,
pace:0.9,
defending:1,
mentality:1.1
}

case "gegenpressing":
return {
passing:1,
dribbling:1,
pace:1.4,
defending:1.1,
mentality:1.3
}

case "konter":
return {
passing:1,
dribbling:1.2,
pace:1.5,
defending:1,
mentality:1
}

case "defensiv":
return {
passing:0.8,
dribbling:0.7,
pace:0.9,
defending:1.5,
mentality:1.2
}

default:
return {
passing:1,
dribbling:1,
pace:1,
defending:1,
mentality:1
}

}

}

/* ======================================================
 ROLLEN PREFERENZEN
====================================================== */

function getRolePreferences(style){

switch(style){

case "ballbesitz":
return {
playmaker:1.4,
ball_playing_cb:1.3,
inverted_winger:1.2,
target_man:0.8
}

case "gegenpressing":
return {
pressing_forward:1.5,
box_to_box:1.3,
ball_winner:1.2
}

case "konter":
return {
pace_winger:1.4,
target_man:1.3,
counter_runner:1.2
}

case "defensiv":
return {
stopper_cb:1.4,
ball_winner:1.3,
target_man:1.2
}

default:
return {}

}

}

/* ======================================================
 BANK GENERATION
====================================================== */

function generateBench(players, usedPlayers){

const remaining = players
.filter(p => !usedPlayers.has(p._id));

const gk = remaining
.filter(p => p.positions?.includes("GK"))
.slice(0,1);

const defenders = remaining
.filter(p =>
p.positions?.includes("CB") ||
p.positions?.includes("LB") ||
p.positions?.includes("RB")
)
.slice(0,2);

const midfielders = remaining
.filter(p =>
p.positions?.includes("CM") ||
p.positions?.includes("CDM") ||
p.positions?.includes("CAM")
)
.slice(0,2);

const attackers = remaining
.filter(p =>
p.positions?.includes("ST") ||
p.positions?.includes("LW") ||
p.positions?.includes("RW")
)
.slice(0,2);

let bench = [
...gk,
...defenders,
...midfielders,
...attackers
];

if(bench.length < 7){

const extra = remaining
.filter(p => !bench.includes(p))
.slice(0, 7 - bench.length);

bench = [...bench, ...extra];

}

return bench
.slice(0,7)
.map(p => p._id);

}
