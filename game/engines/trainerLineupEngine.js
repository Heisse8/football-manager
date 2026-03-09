const { getFormationSlots } = require("./formationSlots");
const { calculatePositionScore } = require("./playerPositionScore");

function generateLineup(team, trainer){

const players = [...(team.players || [])];

if(players.length === 0){
return { formation:"442", lineup:{}, bench:[] };
}

const formation = trainer?.favoriteFormation || team.formation || "442";

const slots = getFormationSlots(formation);

const usedPlayers = new Set();

const lineup = {};

/* ======================================================
 ROTATION INTENSITÄT
====================================================== */

const rotationFactor = getRotationFactor(trainer);

/* ======================================================
 TORWART
====================================================== */

const goalkeeper = players
.filter(p => p.positions?.includes("GK"))
.sort((a,b)=> (b.defending || 50) - (a.defending || 50))[0];

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

/* Fitness Einfluss */

const fitnessModifier = (player.fitness ?? 100) / 100;

/* Rotation Einfluss */

const rotationPenalty =
player.lastMatchStarted ? (1 - rotationFactor) : 1;

/* Positionsscore */

const baseScore = calculatePositionScore(player, position);

const score =
baseScore *
fitnessModifier *
rotationPenalty;

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
 FALLBACK (falls Formation nicht voll)
====================================================== */

if(Object.keys(lineup).length < slots.length){

for(const player of players){

if(usedPlayers.has(player._id)) continue;

const emptySlot = slots.find(s => !lineup[s]);

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
 BANK GENERATION
====================================================== */

function generateBench(players, usedPlayers){

const remaining = players
.filter(p => !usedPlayers.has(p._id));

/* GK */

const gk = remaining
.filter(p => p.positions?.includes("GK"))
.slice(0,1);

/* DEF */

const defenders = remaining
.filter(p =>
p.positions?.includes("CB") ||
p.positions?.includes("LB") ||
p.positions?.includes("RB")
)
.slice(0,2);

/* MID */

const midfielders = remaining
.filter(p =>
p.positions?.includes("CM") ||
p.positions?.includes("CDM") ||
p.positions?.includes("CAM")
)
.slice(0,2);

/* ATT */

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

/* Fallback falls weniger Spieler */

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