// ======================================================
// MATCH ENGINE V11 – FULL FOOTBALL SIMULATION
// Tactical Phase Engine
// Match Story Engine
// Momentum System
// Coach AI
// Possession Engine
// Goalkeeper Saves
// ======================================================

const { generateMatchNews } = require("../utils/newsGenerator");
const { generateMatchRevenue } = require("../utils/matchRevenue");

async function simulateRealisticMatch({ homeTeam, awayTeam, match }) {

const homeCtx = buildTeamContext(homeTeam,true);
const awayCtx = buildTeamContext(awayTeam,false);

const state = createInitialState(homeCtx.players,awayCtx.players);

for(let minute=1; minute<=90; minute++){

state.minute = minute;

applyCoachAdaptation(state,homeCtx,awayCtx);
applyMatchStory(state,homeCtx,awayCtx);

simulateMinute(state,homeCtx,awayCtx);

state.momentum.home *= 0.98;
state.momentum.away *= 0.98;

}

const possession = calculatePossession(state);
const ratings = calculateRatings(state);

applyFitnessLoss(homeCtx.players);
applyFitnessLoss(awayCtx.players);

/* ================= MATCH NEWS ================= */

if(match){

await generateMatchNews({
homeTeam,
awayTeam,
homeGoals:state.home.goals,
awayGoals:state.away.goals,
league:match.league
});

}

/* ================= STADIUM + SPONSOR REVENUE ================= */

if(homeTeam && homeTeam._id){

await generateMatchRevenue(homeTeam._id);

}

/* ================= RETURN RESULT ================= */

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

if(state.minute > 85){

homeCtx.attackStrength *= 1.08;
awayCtx.attackStrength *= 1.08;

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
coach:team.coach || null,
attackStrength:team.attackStrength || 50,
defenseStrength:team.defenseStrength || 50,
possessionSkill:team.possessionSkill || 50,
tactics:team.tactics || {}
};

if(isHome && team.homeBonus){

ctx.attackStrength*=team.homeBonus;
ctx.defenseStrength*=team.homeBonus;

}

applyFormationBonus(ctx,team.formation);
applyTacticInfluence(ctx,team.tactics);
applyCoachInfluence(ctx);
applyCoachStyle(ctx);

return ctx;

}


// ======================================================
// STATE
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
// MINUTE SIMULATION
// ======================================================

function simulateMinute(state,homeCtx,awayCtx){

state.home.control += homeCtx.possessionSkill/1100;
state.away.control += awayCtx.possessionSkill/1100;

const homeMomentum = 1 + clampMomentum(state.momentum.home);
const awayMomentum = 1 + clampMomentum(state.momentum.away);

let homeAttack = homeCtx.attackStrength * homeMomentum;
let awayAttack = awayCtx.attackStrength * awayMomentum;

if(state.home.reds>0) homeAttack*=0.9;
if(state.away.reds>0) awayAttack*=0.9;

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
// TACTICAL PHASE ENGINE
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

const creator = pickCreator(attackCtx.players);

if(!creator) return;

attacking.keyPasses++;

finalThirdPhase(state,attacking,defending,attackCtx,defendCtx,creator);

}

function finalThirdPhase(state,attacking,defending,attackCtx,defendCtx,creator){

if(Math.random()<0.25) attacking.dribbles++;
if(Math.random()<0.22) attacking.crosses++;
if(Math.random()<0.18) attacking.longShots++;

finishPhase(state,attacking,defending,attackCtx,defendCtx,creator);

}

function finishPhase(state,attacking,defending,attackCtx,defendCtx,creator){

const attacker = pickScorer(attackCtx.players);
const goalkeeper = defendCtx.goalkeeper;

let xG = calculateShotQuality(attacker,goalkeeper);

if(Math.random()<0.25){

attacking.bigChances++;
xG*=1.4;

}

attacking.shots++;
attacking.xG+=xG;

if(Math.random()<0.15){

defending.blocks++;
return;

}

if(Math.random()<xG){

attacking.goals++;

updateMomentum(state,attacking);

state.events.push({
minute:state.minute,
type:"goal",
scorer:`${attacker.firstName} ${attacker.lastName}`,
assist:`${creator.firstName} ${creator.lastName}`
});

addStat(state,attacker._id,"goals");
addStat(state,creator._id,"assists");

}else{

defending.saves++;

state.events.push({
minute:state.minute,
type:"save",
goalkeeper:`${goalkeeper?.firstName || "GK"}`
});

}

}


// ======================================================
// MOMENTUM
// ======================================================

function updateMomentum(state,team){

if(team === state.home){

state.momentum.home += 0.15;
state.momentum.away -= 0.1;

}else{

state.momentum.away += 0.15;
state.momentum.home -= 0.1;

}

}

function clampMomentum(v){
return Math.max(-0.4,Math.min(0.4,v));
}


// ======================================================
// PLAYER PICK
// ======================================================

function pickCreator(players){

const weighted=[];

players.forEach(p=>{

let w=1;

if(p.playStyle==="playmaker") w=3;
if(p.playStyle==="winger") w=2;

for(let i=0;i<w;i++) weighted.push(p);

});

return weighted[Math.floor(Math.random()*weighted.length)];

}

function pickScorer(players){

const weighted=[];

players.forEach(p=>{

let w=1;

const pos=p.positions?.[0]||"CM";

switch(pos){

case "ST": w=10; break;
case "LW":
case "RW": w=7; break;
case "CAM": w=6; break;
case "CM": w=4; break;
case "CDM": w=2; break;
case "CB": w=1; break;
case "GK": w=0.02; break;

}

for(let i=0;i<w;i++) weighted.push(p);

});

return weighted[Math.floor(Math.random()*weighted.length)];

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

const days = 3 + Math.floor(Math.random()*25);

const until = new Date();
until.setDate(until.getDate()+days);

player.injuredUntil = until;

}


// ======================================================
// FITNESS
// ======================================================

function applyFitnessLoss(players){

players.forEach(p=>{

const loss = 6 + Math.random()*4;
p.fitness = Math.max(0,(p.fitness||100)-loss);

});

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