// ======================================================
// MATCH ENGINE V16 – FULL FOOTBALL SIMULATION
// Clean + Stable Version
// ======================================================

const Player = require("../models/Player");
const Coach = require("../models/Coach");

const { generateMatchNews } = require("../utils/newsGenerator");
const { generateMatchRevenue } = require("../utils/matchRevenue");

const { chooseFormation } = require("../utils/coachAI");
const { applyPlaystyleImpact } = require("../utils/playstyleImpact");
const { applyTacticImpact } = require("../utils/tacticImpact");
const { getRoleWeights } = require("../utils/playerRoleWeights");

const { applyTrainerImpact } = require("../utils/trainerImpact");

const { generateLineup } = require("./trainerLineupEngine");
const { generateTactics } = require("./trainerTacticEngine");
const { applyPressingEffect } = require("./pressingEngine");
const { applyFormationMatchup } = require("./formationMatchupEngine");
const { determineZoneProgress } = require("./zoneEngine");
const { applyOverloadEffect } = require("./overloadEngine");
const { applyMatchAdaptation } = require("./matchAdaptationEngine");
const { applySpaceCreation } = require("./spaceCreationEngine");
const { applyDefensiveShape } = require("./defensiveShapeEngine");
const { applyTrainerPersonality } = require("../utils/trainerPersonalityEngine");
const { applyTrainerAdaptation } = require("../utils/trainerAdaptationEngine");
const { applyBigChance } = require("./bigChanceEngine");
const { applyFinishingVariance } = require("./finishingVarianceEngine");
const { applyGoalkeeperImpact } = require("./goalkeeperImpactEngine");
const { applyMatchChaos } = require("./matchChaosEngine");

/* ======================================================
MATCH ENGINE ENTRY
====================================================== */

async function simulateRealisticMatch({ homeTeam, awayTeam, match }) {

homeTeam.formation = chooseFormation(homeTeam,awayTeam);
awayTeam.formation = chooseFormation(awayTeam,homeTeam);

/* ======================================================
SPIELER LADEN
====================================================== */

const homePlayers = await Player.find({
team: homeTeam._id,
injuredUntil: { $exists:false }
});

const awayPlayers = await Player.find({
team: awayTeam._id,
injuredUntil: { $exists:false }
});

homeTeam.players = homePlayers;
awayTeam.players = awayPlayers;

/* ======================================================
TRAINER LADEN
====================================================== */

const homeCoach = await Coach.findOne({ team: homeTeam._id });
const awayCoach = await Coach.findOne({ team: awayTeam._id });

/* ======================================================
LINEUP GENERIEREN
====================================================== */

const homeLineup = generateLineup(homeTeam, homeCoach);
const awayLineup = generateLineup(awayTeam, awayCoach);

/* ======================================================
STARTELF FILTERN
====================================================== */

const homeIDs = Object.values(homeLineup.lineup).map(id => id.toString());
const awayIDs = Object.values(awayLineup.lineup).map(id => id.toString());

homeTeam.players = homeTeam.players.filter(p =>
homeIDs.includes(p._id.toString())
);

awayTeam.players = awayTeam.players.filter(p =>
awayIDs.includes(p._id.toString())
);

/* ======================================================
BANK SPEICHERN
====================================================== */

homeTeam.bench = homeLineup.bench;
awayTeam.bench = awayLineup.bench;

/* ======================================================
TEAM CONTEXT
====================================================== */

const homeCtx = buildTeamContext(homeTeam,true);
const awayCtx = buildTeamContext(awayTeam,false);

applyFormationMatchup(homeCtx,awayCtx);

applyTrainerImpact(homeCtx, homeCoach);
applyTrainerImpact(awayCtx, awayCoach);

applyTrainerPersonality(homeCtx, homeCoach);
applyTrainerPersonality(awayCtx, awayCoach);

const state = createInitialState(homeCtx.players,awayCtx.players);

state.homeCtx = homeCtx;
state.awayCtx = awayCtx;

/* ======================================================
MATCH LOOP
====================================================== */

for(let minute=1; minute<=90; minute++){

state.minute = minute;

handleSubstitutions(state,homeCtx);
handleSubstitutions(state,awayCtx);

/* NEU */

applyTrainerAdaptation(state,homeCtx,awayCtx,homeCoach);
applyTrainerAdaptation(state,awayCtx,homeCtx,awayCoach);

applyTacticImpact(homeCtx,state);
applyTacticImpact(awayCtx,state);

simulateMinute(state,homeCtx,awayCtx);

state.momentum.home *= 0.98;
state.momentum.away *= 0.98;

}

/* ======================================================
STATS
====================================================== */

const possession = calculatePossession(state);
const ratings = calculateRatings(state);

/* ======================================================
FITNESS
====================================================== */

await applyFitnessLoss(homeCtx.players);
await applyFitnessLoss(awayCtx.players);

/* ======================================================
NEWS
====================================================== */

if(match){

await generateMatchNews({
homeTeam,
awayTeam,
homeGoals:state.home.goals,
awayGoals:state.away.goals,
league:match.league
});

}

/* ======================================================
REVENUE
====================================================== */

if(homeTeam && homeTeam._id){
await generateMatchRevenue(homeTeam._id);
}

/* ======================================================
RESULT
====================================================== */

return{

result:{
homeGoals:state.home.goals,
awayGoals:state.away.goals
},

xG:{
home:round(state.home.xG),
away:round(state.away.xG)
},

possession,
stats:buildStats(state),
events:state.events,
ratings

};

}

module.exports = { simulateRealisticMatch };


// ======================================================
// TEAM CONTEXT
// ======================================================

function buildTeamContext(team,isHome){

const players = team.players || [];

const goalkeeper =
players.find(p=>p.positions?.includes("GK")) || players[0];

const ctx={

players,
goalkeeper,

attackStrength:team.attackStrength || 50,
defenseStrength:team.defenseStrength || 50,
possessionSkill:team.possessionSkill || 50

};

if(isHome && team.homeBonus){

ctx.attackStrength *= team.homeBonus;
ctx.defenseStrength *= team.homeBonus;

}

return ctx;

}


// ======================================================
// MATCH STATE
// ======================================================

function createInitialState(homePlayers,awayPlayers){

return{

minute:0,
events:[],
playerStats:{},

momentum:{
home:0,
away:0
},

home:baseTeamState(),
away:baseTeamState(),

homePlayers:[...homePlayers],
awayPlayers:[...awayPlayers]

};

}

function baseTeamState(){

return{

goals:0,
xG:0,
control:0,
shots:0,
keyPasses:0,
dribbles:0,
crosses:0,
blocks:0,
turnovers:0,
saves:0,
yellows:0,
reds:0

};

}


// ======================================================
// MATCH FLOW
// ======================================================

function simulateMinute(state,homeCtx,awayCtx){

/* Chance dass überhaupt ein Angriff entsteht */

if(Math.random() > 0.32){
return;
}

state.home.control += homeCtx.possessionSkill/1100;
state.away.control += awayCtx.possessionSkill/1100;

const homeMomentum = 1 + clampMomentum(state.momentum.home);
const awayMomentum = 1 + clampMomentum(state.momentum.away);

const homePressing = applyPressingEffect(homeCtx,awayCtx);
const awayPressing = applyPressingEffect(awayCtx,homeCtx);

const homeOverload = applyOverloadEffect(homeCtx,awayCtx);
const awayOverload = applyOverloadEffect(awayCtx,homeCtx);

let homeAttack =
homeCtx.attackStrength *
homeMomentum *
homePressing.attackModifier *
homeOverload.attackBonus;

let awayAttack =
awayCtx.attackStrength *
awayMomentum *
awayPressing.attackModifier *
awayOverload.attackBonus;

const homeShape = applyDefensiveShape(homeCtx);
const awayShape = applyDefensiveShape(awayCtx);

const homeAttackChance =
(homeAttack) /
(homeAttack + (awayCtx.defenseStrength * awayShape.progressModifier));

const isHomeAttack = Math.random() < homeAttackChance;

const attacking = isHomeAttack ? state.home : state.away;
const defending = isHomeAttack ? state.away : state.home;

const attackCtx = isHomeAttack ? homeCtx : awayCtx;
const defendCtx = isHomeAttack ? awayCtx : homeCtx;

if(!determineZoneProgress(attackCtx,defendCtx)){

attacking.turnovers++;
return;

}

buildUpPhase(state,attacking,defending,attackCtx,defendCtx);

maybeYellow(state,attacking);
maybeRed(state,attacking);
maybeInjury(state,attacking);

}


function handleSubstitutions(state,ctx){

if(state.minute < 70) return;
if(state.minute > 85) return;

if(Math.random() > 0.08) return;

const players = ctx.players;

const tiredPlayers = players.filter(p => (p.fitness || 100) < 70);

if(tiredPlayers.length === 0) return;

const outPlayer = tiredPlayers[Math.floor(Math.random()*tiredPlayers.length)];

const bench = players.filter(p =>
!p.startingXI &&
(p.positions || []).some(pos => outPlayer.positions?.includes(pos))
);

if(bench.length === 0) return;

const sub = bench[Math.floor(Math.random()*bench.length)];

ctx.players = ctx.players.map(p => {

if(p._id.toString() === outPlayer._id.toString()) return sub;
return p;

});

state.events.push({
minute:state.minute,
type:"substitution",
out:`${outPlayer.firstName} ${outPlayer.lastName}`,
in:`${sub.firstName} ${sub.lastName}`
});

}


// ======================================================
// BUILD UP
// ======================================================

function buildUpPhase(state,attacking,defending,attackCtx,defendCtx){

const press = applyPressingEffect(attackCtx,defendCtx);

const shape = applyDefensiveShape(defendCtx);

if(Math.random() < 0.15 * press.turnoverModifier * shape.turnoverModifier){
attacking.turnovers++;
return;

}

midfieldPhase(state,attacking,defending,attackCtx,defendCtx);

}


function midfieldPhase(state,attacking,defending,attackCtx,defendCtx){

if(Math.random()<0.20){

attacking.turnovers++;
return;

}

let creator = pickWeightedCreator(attackCtx.players);

const defenders = defendCtx.players.filter(p =>
p.positions?.includes("CM") ||
p.positions?.includes("CDM") ||
p.positions?.includes("CB")
);

if(pressingDuel(creator,defenders)){

defending.turnovers++;

state.events.push({
minute:state.minute,
type:"interception",
player:`${defenders[0].firstName} ${defenders[0].lastName}`
});

return;

}
if(!creator) return;

function pressingDuel(attacker,defenders){

if(!attacker) return false;

const defender = defenders[Math.floor(Math.random()*defenders.length)];
if(!defender) return false;

const atkSkill =
(attacker.passing||50)*0.6 +
(attacker.mentality||50)*0.4;

const defSkill =
(defender.defending||50)*0.6 +
(defender.physical||50)*0.4;

return defSkill > atkSkill;

}

/* DRIBBLE */

let dribbleChance = 0.12;

if(creator.playstyles?.includes("dribble_winger")) dribbleChance += 0.12;
if(creator.playstyles?.includes("dribbling_cam")) dribbleChance += 0.10;

if(Math.random() < dribbleChance){

attacking.dribbles++;
finishPhase(state,attacking,defending,attackCtx,defendCtx,creator);
return;

}

/* CROSS */

let crossChance = 0.10;

if(creator.playstyles?.includes("crossing_winger")) crossChance += 0.15;
if(creator.playstyles?.includes("wingback")) crossChance += 0.10;

if(Math.random() < crossChance){

attacking.crosses++;
finishPhase(state,attacking,defending,attackCtx,defendCtx,creator);
return;

}

/* PASS */

attacking.keyPasses++;

finishPhase(state,attacking,defending,attackCtx,defendCtx,creator);

}


// ======================================================
// FINISH PHASE
// ======================================================

function finishPhase(state,attacking,defending,attackCtx,defendCtx,creator){

const attackers = attackCtx.players.filter(p =>
p.positions?.includes("ST") ||
p.positions?.includes("LW") ||
p.positions?.includes("RW") ||
p.positions?.includes("CAM")
);

const attacker = pickAttacker(
attackers.length ? attackers : attackCtx.players
);

const goalkeeper = defendCtx.goalkeeper;

if(!attacker) return;

/* SHOT ZONE */

let shotZone="box";

const r=Math.random();

if(r<0.15) shotZone="long";
else if(r<0.55) shotZone="box";
else shotZone="close";

let zoneMultiplier=1;

if(shotZone==="long") zoneMultiplier=0.4;
if(shotZone==="close") zoneMultiplier=1.6;

/* ENGINES */

const overload = applyOverloadEffect(attackCtx,defendCtx);
const space = applySpaceCreation(attackCtx,defendCtx);
const shape = applyDefensiveShape(defendCtx);

/* CHAOS */

const defenders = defendCtx.players.filter(p =>
p.positions?.includes("CB") ||
p.positions?.includes("LB") ||
p.positions?.includes("RB") ||
p.positions?.includes("CDM")
);

const defender = pickRandom(defenders);

const chaos = applyMatchChaos(state, attacker, defender, goalkeeper);

/* xG */

let xG =
calculateShotQuality(attacker,goalkeeper) *
zoneMultiplier *
overload.chanceBonus *
space.spaceBonus *
shape.shotSuppression *
(chaos.xGMultiplier || 1);

/* BIG CHANCE */

const isBigChance = applyBigChance(state, attacker, goalkeeper);

if(isBigChance){

xG *= 2.2;

state.events.push({
minute:state.minute,
type:"big_chance",
player:`${attacker.firstName} ${attacker.lastName}`
});

}

/* VARIANCE */

xG = applyFinishingVariance(xG, attacker);

/* GOALKEEPER IMPACT */

xG = applyGoalkeeperImpact(xG, attacker, goalkeeper);

/* CHAOS EVENTS */

if(chaos.events){

chaos.events.forEach(e=>{
state.events.push({
minute:state.minute,
type:e.type,
player:e.player
});
});

}

if(chaos.chaosGoal){

attacking.goals++;

state.events.push({
minute:state.minute,
type:"goal",
scorer:`${attacker.firstName} ${attacker.lastName}`,
chaos:true
});

return;

}

/* BLOCK */

let blockChance = 0.14;

if(defender?.playstyles?.includes("stopper_cb")) blockChance += 0.12;
if(defender?.playstyles?.includes("interceptor_cb")) blockChance += 0.10;

if(Math.random() < blockChance){

defending.blocks++;

state.events.push({
minute:state.minute,
type:"block",
player:`${defender.firstName} ${defender.lastName}`
});

return;

}

/* GOAL */

attacking.shots++;
attacking.xG += xG;

if(Math.random() < xG){

attacking.goals++;

let assistName=null;

if(creator && creator._id.toString() !== attacker._id.toString()){

assistName=`${creator.firstName} ${creator.lastName}`;
addStat(state,creator._id,"assists");

}

state.events.push({
minute:state.minute,
type:"goal",
scorer:`${attacker.firstName} ${attacker.lastName}`,
assist:assistName
});

addStat(state,attacker._id,"goals");

}else{

defending.saves++;

}

}
// ======================================================
// PLAYER SELECTION
// ======================================================

function pickAttacker(players){

const weighted=[];

for(const p of players){

let weight=1;

if(p.positions?.includes("ST")) weight=6;
else if(p.positions?.includes("CAM")) weight=4;
else if(p.positions?.includes("LW") || p.positions?.includes("RW")) weight=3;
else if(p.positions?.includes("CM")) weight=2;
else if(p.positions?.includes("CDM")) weight=1;

for(let i=0;i<weight;i++){
weighted.push(p);
}

}

return weighted[Math.floor(Math.random()*weighted.length)];

}

function pickWeightedCreator(players){

let totalWeight=0;
const weights=[];

for(const p of players){

const role=getRoleWeights(p);
const w=role.pass + role.dribble;

weights.push(w);
totalWeight+=w;

}

let r=Math.random()*totalWeight;

for(let i=0;i<players.length;i++){

if(r < weights[i]) return players[i];

r-=weights[i];

}

return players[0];

}

function pickRandom(players){
return players[Math.floor(Math.random()*players.length)];
}


// ======================================================
// SHOT QUALITY
// ======================================================

function calculateShotQuality(attacker,goalkeeper){

let context = {
shotBonus:0,
paceBonus:0
};

context = applyPlaystyleImpact(attacker,context);

let atk =
(attacker.shooting||50)*(0.6 + context.shotBonus) +
(attacker.pace||50)*(0.2 + context.paceBonus) +
(attacker.mentality||50)*0.2;

if(attacker.stars >= 5) atk *= 1.18;
else if(attacker.stars >= 4.5) atk *= 1.12;

const def =
(goalkeeper?.defending||50)*0.7 +
(goalkeeper?.mentality||50)*0.3;

const duel = atk/(atk+def);

return 0.015 + duel*0.28;

}

function headingDuel(attacker,defenders){

const defender = defenders[Math.floor(Math.random()*defenders.length)];
if(!defender) return 0.4;

const atk =
(attacker.physical||50)*0.6 +
(attacker.mentality||50)*0.4;

const def =
(defender.physical||50)*0.7 +
(defender.defending||50)*0.3;

return atk/(atk+def);

}


// ======================================================
// MOMENTUM
// ======================================================

function clampMomentum(v){
return Math.max(-0.4,Math.min(0.4,v));
}


// ======================================================
// EVENTS
// ======================================================

function maybeYellow(state,team){
if(Math.random()<0.0025) team.yellows++;
}

function maybeRed(state,team){
if(Math.random()<0.00025) team.reds++;
}


// ======================================================
// INJURY
// ======================================================

async function maybeInjury(state,team){

if(Math.random()>0.0006) return;

const players = team===state.home ? state.homePlayers : state.awayPlayers;

const player = players[Math.floor(Math.random()*players.length)];
if(!player) return;

const days = 3 + Math.floor(Math.random()*25);

const until = new Date();
until.setDate(until.getDate()+days);

player.injuredUntil = until;

await player.save();

}


// ======================================================
// FITNESS
// ======================================================

async function applyFitnessLoss(players){

const updates = players.map(p=>{

const loss = 6 + Math.random()*4;

return{
updateOne:{
filter:{_id:p._id},
update:{fitness:Math.max(0,(p.fitness||100)-loss)}
}
};

});

await Player.bulkWrite(updates);

}


// ======================================================
// PLAYER STATS
// ======================================================

function addStat(state,id,stat){

if(!state.playerStats[id]){
state.playerStats[id]={goals:0,assists:0};
}

state.playerStats[id][stat]++;

}


// ======================================================
// RATINGS
// ======================================================

function calculateRatings(state){

const ratings={};

for(const id in state.playerStats){

const stats=state.playerStats[id];

let rating=6;

rating += stats.goals*1.5;
rating += stats.assists;

ratings[id]=round(Math.min(10,rating+Math.random()*0.8));

}

return ratings;

}


// ======================================================
// POSSESSION
// ======================================================

function calculatePossession(state){

const total = state.home.control + state.away.control;
const home = (state.home.control/total)*100;

return{
home:Math.round(home),
away:Math.round(100-home)
};

}


// ======================================================
// STATS
// ======================================================

function buildStats(state){

return{

shots:{
home:state.home.shots,
away:state.away.shots
},

dribbles:{
home:state.home.dribbles,
away:state.away.dribbles
},

crosses:{
home:state.home.crosses,
away:state.away.crosses
},

blocks:{
home:state.home.blocks,
away:state.away.blocks
},

turnovers:{
home:state.home.turnovers,
away:state.away.turnovers
},

cards:{
home:{yellow:state.home.yellows,red:state.home.reds},
away:{yellow:state.away.yellows,red:state.away.reds}
}

};

}


// ======================================================
// UTILS
// ======================================================

function round(n){
return Number(n.toFixed(2));
}