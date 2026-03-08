// ======================================================
// MATCH ENGINE V13 – FULL FOOTBALL SIMULATION
// Trainer KI + Formation System
// ======================================================

const Player = require("../models/Player");

const { generateMatchNews } = require("../utils/newsGenerator");
const { generateMatchRevenue } = require("../utils/matchRevenue");
const { chooseFormation } = require("../utils/coachAI");

/* ======================================================
MATCH ENGINE ENTRY
====================================================== */

async function simulateRealisticMatch({ homeTeam, awayTeam, match }) {

/* ================= FORMATION KI ================= */

homeTeam.formation = chooseFormation(homeTeam,awayTeam);
awayTeam.formation = chooseFormation(awayTeam,homeTeam);

/* ================= SPIELER LADEN ================= */

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

/* ================= CONTEXT ================= */

const homeCtx = buildTeamContext(homeTeam,true);
const awayCtx = buildTeamContext(awayTeam,false);

/* ================= MATCH STATE ================= */

const state = createInitialState(homeCtx.players,awayCtx.players);

/* ================= MATCH LOOP ================= */

for(let minute=1; minute<=90; minute++){

state.minute = minute;

applyCoachAdaptation(state,homeCtx,awayCtx);
applyMatchStory(state,homeCtx,awayCtx);

simulateMinute(state,homeCtx,awayCtx);

state.momentum.home *= 0.98;
state.momentum.away *= 0.98;

}

/* ================= STATS ================= */

const possession = calculatePossession(state);
const ratings = calculateRatings(state);

/* ================= FITNESS ================= */

await applyFitnessLoss(homeCtx.players);
await applyFitnessLoss(awayCtx.players);

/* ================= NEWS ================= */

if(match){

await generateMatchNews({
homeTeam,
awayTeam,
homeGoals:state.home.goals,
awayGoals:state.away.goals,
league:match.league
});

}

/* ================= REVENUE ================= */

if(homeTeam && homeTeam._id){
await generateMatchRevenue(homeTeam._id);
}

/* ================= RESULT ================= */

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
// TRAINER ANPASSUNG
// ======================================================

function applyCoachAdaptation(state,homeCtx,awayCtx){

const diff = state.home.goals - state.away.goals;

/* Heimteam verliert */

if(diff < 0 && state.minute > 60){

homeCtx.attackStrength *= 1.08;
homeCtx.defenseStrength *= 0.95;

}

/* Auswärtsteam verliert */

if(diff > 0 && state.minute > 60){

awayCtx.attackStrength *= 1.08;
awayCtx.defenseStrength *= 0.95;

}

/* Führung verteidigen */

if(diff > 0 && state.minute > 75){

homeCtx.attackStrength *= 0.92;
homeCtx.defenseStrength *= 1.05;

}

if(diff < 0 && state.minute > 75){

awayCtx.attackStrength *= 0.92;
awayCtx.defenseStrength *= 1.05;

}

}


// ======================================================
// TEAM CONTEXT
// ======================================================

function buildTeamContext(team,isHome){

const players = team.players || [];

const ctx={
players,
goalkeeper: players.find(p=>p.positions?.includes("GK")),
attackStrength:team.attackStrength || 50,
defenseStrength:team.defenseStrength || 50,
possessionSkill:team.possessionSkill || 50,
tactics:team.tactics || {}
};

if(isHome && team.homeBonus){

ctx.attackStrength*=team.homeBonus;
ctx.defenseStrength*=team.homeBonus;

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
bigChances:0,
keyPasses:0,
dribbles:0,
crosses:0,
longShots:0,
blocks:0,
turnovers:0,
saves:0,
yellows:0,
reds:0

};

}


// ======================================================
// MATCH STORY ENGINE
// ======================================================

function applyMatchStory(state,homeCtx,awayCtx){

const diff = state.home.goals - state.away.goals;

if(diff < 0){

homeCtx.attackStrength *= 1.05;
state.momentum.home += 0.02;

}

if(diff > 0){

awayCtx.attackStrength *= 1.05;
state.momentum.away += 0.02;

}

if(diff > 0 && state.minute > 70){

homeCtx.defenseStrength *= 1.05;
homeCtx.attackStrength *= 0.96;

}

if(diff < 0 && state.minute > 70){

awayCtx.defenseStrength *= 1.05;
awayCtx.attackStrength *= 0.96;

}

}


// ======================================================
// MINUTE SIMULATION
// ======================================================

function simulateMinute(state,homeCtx,awayCtx){

state.home.control += homeCtx.possessionSkill/1100;
state.away.control += awayCtx.possessionSkill/1100;

const homeMomentum = 1 + clampMomentum(state.momentum.home);
const awayMomentum = 1 + clampMomentum(state.momentum.away);

let homeAttack = homeCtx.attackStrength * homeMomentum;
let awayAttack = awayCtx.attackStrength * awayMomentum;

const homeAttackChance =
homeAttack /
(homeAttack + awayCtx.defenseStrength);

const isHomeAttack = Math.random() < homeAttackChance;

const attacking = isHomeAttack ? state.home : state.away;
const defending = isHomeAttack ? state.away : state.home;

const attackCtx = isHomeAttack ? homeCtx : awayCtx;
const defendCtx = isHomeAttack ? awayCtx : homeCtx;

buildUpPhase(state,attacking,defending,attackCtx,defendCtx);

maybeYellow(state,attacking);
maybeRed(state,attacking);
maybeInjury(state,attacking);

}


// ======================================================
// BUILD UP PHASE
// ======================================================

function buildUpPhase(state,attacking,defending,attackCtx,defendCtx){

if(Math.random()<0.15){

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

const creator = pickRandom(attackCtx.players);

if(!creator) return;

attacking.keyPasses++;

finishPhase(state,attacking,defending,attackCtx,defendCtx,creator);

}


// ======================================================
// FINISH PHASE
// ======================================================

function finishPhase(state,attacking,defending,attackCtx,defendCtx,creator){

const attacker = pickRandom(attackCtx.players);
const goalkeeper = defendCtx.goalkeeper;

if(!attacker) return;

let xG = calculateShotQuality(attacker,goalkeeper);

attacking.shots++;
attacking.xG+=xG;

if(Math.random()<xG){

attacking.goals++;

state.events.push({
minute:state.minute,
type:"goal",
scorer:`${attacker.firstName} ${attacker.lastName}`
});

addStat(state,attacker._id,"goals");

}else{

defending.saves++;

}

}


// ======================================================
// PLAYER PICK
// ======================================================

function pickRandom(players){

if(!players || players.length===0) return null;

return players[Math.floor(Math.random()*players.length)];

}


// ======================================================
// SHOT QUALITY
// ======================================================

function calculateShotQuality(attacker,goalkeeper){

const atk =
(attacker.shooting||50)*0.6 +
(attacker.pace||50)*0.2 +
(attacker.mentality||50)*0.2;

const def =
(goalkeeper?.defending||50)*0.7 +
(goalkeeper?.mentality||50)*0.3;

const duel = atk/(atk+def);

return 0.05 + duel*0.30;

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

function maybeInjury(state,team){

if(Math.random()>0.0006) return;

const players = team===state.home ? state.homePlayers : state.awayPlayers;
const player = players[Math.floor(Math.random()*players.length)];

if(!player) return;

const days = 3 + Math.floor(Math.random()*25);

const until = new Date();
until.setDate(until.getDate()+days);

player.injuredUntil = until;
player.save();

}


// ======================================================
// FITNESS
// ======================================================

async function applyFitnessLoss(players){

for(const p of players){

const loss = 6 + Math.random()*4;
p.fitness = Math.max(0,(p.fitness||100)-loss);

await p.save();

}

}


// ======================================================
// STATS
// ======================================================

function addStat(state,id,stat){

if(!state.playerStats[id]){
state.playerStats[id]={goals:0,assists:0};
}

state.playerStats[id][stat]++;

}

function calculateRatings(state){

const ratings={};

for(const id in state.playerStats){

const stats=state.playerStats[id];

let rating=6;

rating+=stats.goals*1.5;
rating+=stats.assists*1;

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
// BUILD STATS
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

longShots:{
home:state.home.longShots,
away:state.away.longShots
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