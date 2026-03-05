// ======================================================
// MATCH ENGINE – COMPLETE VERSION
// Goals, Assists, Ratings, Cards, Injuries,
// Goalkeeper System, Fitness, Stadium Revenue
// + PLAYSTYLE SYSTEM
// + FORMATION SYSTEM
// ======================================================

const { generateMatchNews } = require("../utils/newsGenerator");
const { generateMatchRevenue } = require("../utils/matchRevenue");

async function simulateRealisticMatch({ homeTeam, awayTeam, match }) {

const homeCtx = buildTeamContext(homeTeam, true);
const awayCtx = buildTeamContext(awayTeam, false);

const state = createInitialState(homeCtx.players, awayCtx.players);

for (let minute = 1; minute <= 90; minute++) {

state.minute = minute;

simulateMinute(state, homeCtx, awayCtx);

}

const possession = calculatePossession(state);

/* ================= RATINGS ================= */

const ratings = calculateRatings(state);

/* ================= FITNESS ================= */

applyFitnessLoss(homeCtx.players);
applyFitnessLoss(awayCtx.players);

/* ================= NEWS ================= */

if (match) {

await generateMatchNews({
homeTeam,
awayTeam,
homeGoals: state.home.goals,
awayGoals: state.away.goals,
league: match.league
});

}

/* ================= STADIUM REVENUE ================= */

if (homeTeam && homeTeam._id) {
await generateMatchRevenue(homeTeam._id);
}

return {

result: {
homeGoals: state.home.goals,
awayGoals: state.away.goals
},

xG: {
home: round(state.home.xG),
away: round(state.away.xG)
},

possession,

stats: buildStats(state),

events: state.events,

ratings

};

}

module.exports = { simulateRealisticMatch };



/* ====================================================== */
/* TEAM CONTEXT */
/* ====================================================== */

function buildTeamContext(team, isHome){

const players = team.players || [];

let attack = team.attackStrength || 50;
let defense = team.defenseStrength || 50;
let possession = team.possessionSkill || 50;

const goalkeeper = players.find(p => p.positions?.includes("GK"));

const ctx = {
players,
goalkeeper,
attackStrength: attack,
defenseStrength: defense,
possessionSkill: possession
};

if(isHome && team.homeBonus){
ctx.attackStrength *= team.homeBonus;
ctx.defenseStrength *= team.homeBonus;
}

/* FORMATION BONUS */

applyFormationBonus(ctx, team.formation);

return ctx;

}



/* ====================================================== */
/* FORMATION SYSTEM */
/* ====================================================== */

function applyFormationBonus(ctx, formation){

if(!formation) return;

switch(formation){

case "433":

ctx.attackStrength *= 1.08;
ctx.possessionSkill *= 1.05;

break;

case "4231":

ctx.attackStrength *= 1.05;
ctx.defenseStrength *= 1.05;

break;

case "442":

ctx.attackStrength *= 1.04;
ctx.defenseStrength *= 1.04;

break;

case "41212":

ctx.attackStrength *= 1.06;
ctx.possessionSkill *= 1.04;

break;

case "4141":

ctx.defenseStrength *= 1.10;

break;

case "352":

ctx.possessionSkill *= 1.08;

break;

case "343":

ctx.attackStrength *= 1.10;
ctx.defenseStrength *= 0.95;

break;

case "3421":

ctx.attackStrength *= 1.08;

break;

case "532":

ctx.defenseStrength *= 1.12;
ctx.attackStrength *= 0.92;

break;

case "541":

ctx.defenseStrength *= 1.15;
ctx.attackStrength *= 0.88;

break;

case "5212":

ctx.defenseStrength *= 1.08;
ctx.attackStrength *= 1.04;

break;

}

}



/* ====================================================== */
/* STATE */
/* ====================================================== */

function createInitialState(homePlayers, awayPlayers){

return {

minute: 0,

events: [],

playerStats: {},

home: baseTeamState(),
away: baseTeamState(),

homePlayers,
awayPlayers

};

}

function baseTeamState(){

return {
goals: 0,
xG: 0,
control: 0,
shots: 0,
saves: 0,
yellows: 0,
reds: 0,
corners: 0,
freeKicks: 0,
penalties: 0
};

}



/* ====================================================== */
/* PLAYER PICK */
/* ====================================================== */

function pickRandomPlayer(players){

if(!players || players.length === 0) return null;

return players[Math.floor(Math.random()*players.length)];

}



/* ====================================================== */
/* SCORER WEIGHT */
/* ====================================================== */

function pickScorer(players){

if(!players) return null;

const weighted = [];

players.forEach(p=>{

const pos = p.positions?.[0] || "CM";

let weight = 1;

switch(pos){

case "ST":
case "LST":
case "RST":
weight = 10;
break;

case "LW":
case "RW":
weight = 8;
break;

case "CAM":
weight = 6;
break;

case "CM":
case "LCM":
case "RCM":
weight = 4;
break;

case "CDM":
weight = 2;
break;

case "LB":
case "RB":
weight = 1.5;
break;

case "CB":
weight = 1;
break;

case "GK":
weight = 0.05;
break;

}

/* Playstyle Bonus */

if(p.playStyle === "finisher") weight *= 1.4;
if(p.playStyle === "targetman") weight *= 1.2;

for(let i=0;i<weight;i++){
weighted.push(p);
}

});

return weighted[Math.floor(Math.random()*weighted.length)];

}



/* ====================================================== */
/* PLAYER ATTRIBUTES */
/* ====================================================== */

function getPlayerAttackValue(player){

if(!player) return 50;

let value = (
(player.shooting || 50) * 0.5 +
(player.pace || 50) * 0.2 +
(player.mentality || 50) * 0.3
);

if(player.playStyle === "finisher") value *= 1.15;
if(player.playStyle === "targetman") value *= 1.10;
if(player.playStyle === "box_to_box") value *= 1.05;

return value;

}

function getGoalkeeperValue(player){

if(!player) return 50;

let value = (
(player.defending || 50) * 0.5 +
(player.mentality || 50) * 0.3 +
(player.physical || 50) * 0.2
);

if(player.playStyle === "sweeper_keeper") value *= 1.15;

return value;

}



/* ====================================================== */
/* MINUTE SIMULATION */
/* ====================================================== */

function simulateMinute(state, homeCtx, awayCtx){

state.home.control += homeCtx.possessionSkill / 1100;
state.away.control += awayCtx.possessionSkill / 1100;

const homeAttacks = Math.random() < 0.5;

const attacking = homeAttacks ? state.home : state.away;
const defending = homeAttacks ? state.away : state.home;

const attackCtx = homeAttacks ? homeCtx : awayCtx;
const defendCtx = homeAttacks ? awayCtx : homeCtx;

runAttack(state, attacking, defending, attackCtx, defendCtx);

maybeYellow(state, attacking);
maybeRed(state, attacking);
maybeInjury(state, attacking);

}



/* ====================================================== */
/* ATTACK */
/* ====================================================== */

function runAttack(state, attacking, defending, attackCtx, defendCtx){

const attacker = pickScorer(attackCtx.players);
const goalkeeper = defendCtx.goalkeeper;

const attackValue = getPlayerAttackValue(attacker);
const keeperValue = getGoalkeeperValue(goalkeeper);

const duel = attackValue / (attackValue + keeperValue);

const xG = 0.05 + duel * 0.35;

attacking.xG += xG;
attacking.shots++;

if(Math.random() < xG){

attacking.goals++;

const assist = pickAssist(attackCtx.players, attacker);

state.events.push({
minute: state.minute,
type: "goal",
scorer: attacker ? `${attacker.firstName} ${attacker.lastName}` : null,
assist: assist ? `${assist.firstName} ${assist.lastName}` : null
});

if(attacker) addStat(state, attacker._id, "goals");
if(assist) addStat(state, assist._id, "assists");

}else{

defending.saves++;

}

}



/* ====================================================== */
/* ASSIST PICK */
/* ====================================================== */

function pickAssist(players, scorer){

const candidates = players.filter(p => p !== scorer);

if(candidates.length === 0) return null;

const weighted = [];

candidates.forEach(p=>{

let weight = 1;

if(p.playStyle === "playmaker") weight *= 2;
if(p.playStyle === "winger") weight *= 1.6;

for(let i=0;i<weight;i++){
weighted.push(p);
}

});

return weighted[Math.floor(Math.random()*weighted.length)];

}



/* ====================================================== */
/* EVENTS */
/* ====================================================== */

function maybeYellow(state, team){

if (Math.random() > 0.0025) return;

team.yellows++;

}

function maybeRed(state, team){

if (Math.random() > 0.00025) return;

team.reds++;

}

function maybeInjury(state, team){

if(Math.random() > 0.0006) return;

const player = pickRandomPlayer(
team === state.home ? state.homePlayers : state.awayPlayers
);

if(!player) return;

const days = 3 + Math.floor(Math.random()*25);

const until = new Date();
until.setDate(until.getDate()+days);

player.injuredUntil = until;

}



/* ====================================================== */
/* FITNESS */
/* ====================================================== */

function applyFitnessLoss(players){

if(!players) return;

players.forEach(p=>{

const loss = 6 + Math.random()*4;

p.fitness = Math.max(0,(p.fitness||100)-loss);

});

}



/* ====================================================== */
/* STATS */
/* ====================================================== */

function addStat(state, playerId, stat){

if(!state.playerStats[playerId]){
state.playerStats[playerId] = {goals:0,assists:0};
}

state.playerStats[playerId][stat]++;

}

function calculateRatings(state){

const ratings = {};

for(const playerId in state.playerStats){

const stats = state.playerStats[playerId];

let rating = 6.0;

rating += stats.goals * 1.5;
rating += stats.assists * 1;

ratings[playerId] = round(
Math.min(10, rating + Math.random()*0.8)
);

}

return ratings;

}



/* ====================================================== */
/* POSSESSION */
/* ====================================================== */

function calculatePossession(state){

const total = state.home.control + state.away.control;

const home = total > 0
? (state.home.control / total) * 100
: 50;

return {
home: Math.round(home),
away: Math.round(100-home)
};

}



/* ====================================================== */
/* UTILS */
/* ====================================================== */

function round(n){
return Number(n.toFixed(2));
}