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
const { applyOverloadEffect } = require("./overloadEngine");
const { applyMatchAdaptation } = require("./matchAdaptationEngine");
const { applySpaceCreation } = require("./spaceCreationEngine");
const { applyDefensiveShape } = require("./defensiveShapeEngine");
const { applyTrainerPersonality } = require("../utils/trainerPersonalityEngine");
const { applyTrainerAdaptation } = require("../utils/trainerAdaptationEngine");
const { applyBigChance } = require("../utils/bigChanceEngine");
const { applyFinishingVariance } = require("../utils/finishingVarianceEngine");
const { applyGoalkeeperImpact } = require("../utils/goalkeeperImpactEngine");
const { applyMatchChaos } = require("../utils/matchChaosEngine");
const { applyCutbackChance } = require("../engines/cutbackEngine");
const { applyOffsideTrap } = require("../engines/offsideTrapEngine");
const { applyCompactness } = require("../engines/compactnessEngine");
const { applySecondBallChance } = require("../engines/secondBallEngine");
const { applyTransitionMoment } = require("../engines/transitionEngine");
const { applyPressResistance } = require("../engines/pressResistanceEngine");
const { applyTacticalWidth } = require("../engines/tacticalWidthEngine");
const { applyGameManagement } = require("../engines/gameManagementEngine");
const { applyDynamicTempo } = require("../engines/dynamicTempoEngine");
const { applyWingBackOverlap } = require("../engines/wingBackOverlapEngine");
const { applyMarking } = require("../engines/markingEngine");
const { applyBlockingPosition } = require("../engines/blockingPositionEngine");
const {
generateTacticalIdentity,
applyTacticalIdentity
} = require("../engines/tacticalIdentityEngine");
const { applyKeeperPositioning } = require("../engines/keeperPositioningEngine");
const { applyRecoveryRun } = require("../engines/recoveryRunEngine");
const { applyPassRisk } = require("../engines/passRiskEngine");
const { applyGoalkeeperReaction } = require("../engines/goalkeeperReactionEngine");
const { applyDefensiveCoverage } = require("../engines/defensiveCoverageEngine");
const { applySpatialAwareness } = require("../engines/spatialAwarenessEngine");
const {
applyDynamicPassingNetwork,
choosePassTarget
} = require("./passingNetworkEngine");
const { applyDefensiveRotation } = require("../engines/defensiveRotationEngine");
const { determineAssistType } = require("../engines/assistTypeEngine");
const { generateMatchNarrative } = require("../utils/matchNarrativeEngine");
const { getShotQuality } = require("../engines/shotQualityMap");
const { applyPlayerPersonality } = require("../engines/playerPersonalityEngine");
const {
initializePlayerPositions,
movePlayers,
calculatePassPressure,
passingLaneBlocked
} = require("../engines/spatialPositioningEngine")
const { applyDynamicTacticalAdjustments } =
require("../engines/dynamicTacticalAdjustments");
const { applyFormationShift } =
require("../engines/formationShiftEngine");
const { runXTChain } =
require("../engines/xTChainEngine");
const { applyPossessionStructure } =
require("../engines/possessionStructureEngine");
const { applyTeamShape } =
require("../engines/teamShapeEngine");
const { applyDefensiveBlock } =
require("../engines/defensiveBlockEngine");
const { applyManagerDecisions } =
require("../engines/managerDecisionEngine");
const { applyTrainerStructure } =
require("../engines/trainerStructureEngine");
const { applyTrainerSubstitutions } =
require("../engines/trainerSubstitutionEngine");
const { applyTrainerTacticalProfile } =
require("../engines/trainerTacticalProfileEngine");
const { generateDynamicCoachDNA } =
require("../engines/trainerDynamicDNAEngine");
const { applyCoachTactics } = require("./applyCoachTactics")
const { applyTrainerGameManagement } =
require("../engines/trainerGameManagementEngine");
const { applyPlayerDevelopment } =
require("../engines/playerDevelopmentEngine");
const { generateTrainerIdentity } =
require("../engines/trainerIdentityEngine")
const { chooseFormation: chooseTrainerFormation } = require("./trainerFormationEngine")






/* ======================================================
MATCH ENGINE ENTRY
====================================================== */

async function simulateRealisticMatch({
homeTeam,
awayTeam,
homePlayers,
awayPlayers,
homeCoach,
awayCoach,
match
}){

const { chooseFormation } =
require("../engines/trainerFormationEngine")


const homeFormation = chooseTrainerFormation(homeTeam, homeCoach)
const awayFormation = chooseTrainerFormation(awayTeam, awayCoach)

homeTeam.formation = homeFormation || "4-4-2"
awayTeam.formation = awayFormation || "4-4-2"




/* ======================================================
SPIELER LADEN
====================================================== */

homeTeam.players = homePlayers;
awayTeam.players = awayPlayers;

homeTeam.coachDNA = homeCoach?.coachDNA
awayTeam.coachDNA = awayCoach?.coachDNA

/* ======================================================
LINEUP GENERIEREN
====================================================== */

const homeLineup = generateLineup(homeTeam, homeCoach);
const awayLineup = generateLineup(awayTeam, awayCoach);

/* ======================================================
STARTELF FILTERN
====================================================== */

// TEST MODE → kein Lineup Filter
if(process.env.TEST_MODE !== "true"){

const homeIDs = Object.values(homeLineup.lineup).map(id => id.toString());
const awayIDs = Object.values(awayLineup.lineup).map(id => id.toString());

homeTeam.players = homeTeam.players.filter(p =>
homeIDs.includes(p._id.toString())
);

awayTeam.players = awayTeam.players.filter(p =>
awayIDs.includes(p._id.toString())
);

}

if(process.env.DEBUG_MATCH){
console.log("Home players:", homeTeam.players.length)
console.log("Away players:", awayTeam.players.length)
}

/* ======================================================
BANK SPEICHERN
====================================================== */

homeTeam.bench = homeLineup.bench;
awayTeam.bench = awayLineup.bench;

// ======================================================
// TEAM CONTEXT
// ======================================================

const homeCtx = buildTeamContext(homeTeam,true);
const awayCtx = buildTeamContext(awayTeam,false);

if(process.env.DEBUG_MATCH){
console.log("CTX AFTER BUILD", {
homeAttack: homeCtx.attackStrength,
homeDefense: homeCtx.defenseStrength,
homePossession: homeCtx.possessionSkill,
awayAttack: awayCtx.attackStrength,
awayDefense: awayCtx.defenseStrength,
awayPossession: awayCtx.possessionSkill
})
}


homeCtx.trainerIdentity =
generateTrainerIdentity(homeCoach)

awayCtx.trainerIdentity =
generateTrainerIdentity(awayCoach)

homeCtx.dynamicDNA =
generateDynamicCoachDNA(homeCtx,homeCoach)

awayCtx.dynamicDNA =
generateDynamicCoachDNA(awayCtx,awayCoach)


applyTrainerTacticalProfile(homeCtx)
applyTrainerTacticalProfile(awayCtx)

if(process.env.DEBUG_MATCH){
console.log("AFTER tactical profile", homeCtx.possessionSkill, awayCtx.possessionSkill)
}


applyTrainerStructure(homeCtx)
applyTrainerStructure(awayCtx)

if(process.env.DEBUG_MATCH){
console.log("AFTER trainer structure", homeCtx.possessionSkill, awayCtx.possessionSkill)
}

applyTeamShape(homeCtx)
applyTeamShape(awayCtx)

if(process.env.DEBUG_MATCH){
console.log("AFTER team shape", homeCtx.possessionSkill, awayCtx.possessionSkill)
}

applyPossessionStructure(homeCtx)
applyPossessionStructure(awayCtx)

if(process.env.DEBUG_MATCH){
console.log("AFTER possession structure", homeCtx.possessionSkill, awayCtx.possessionSkill)
}


// SAFETY CHECK

function fixCtx(ctx){

if(!Number.isFinite(ctx.attackStrength)) ctx.attackStrength = 50
if(!Number.isFinite(ctx.defenseStrength)) ctx.defenseStrength = 50
if(!Number.isFinite(ctx.possessionSkill)) ctx.possessionSkill = 50

}

fixCtx(homeCtx)
fixCtx(awayCtx)


applyDynamicPassingNetwork(homeCtx)
applyDynamicPassingNetwork(awayCtx)

initializePlayerPositions(homeCtx,true)
initializePlayerPositions(awayCtx,false)

const homeIdentity = generateTacticalIdentity(homeTeam)
const awayIdentity = generateTacticalIdentity(awayTeam)

applyTacticalIdentity(homeCtx, homeIdentity)
applyTacticalIdentity(awayCtx, awayIdentity)

applyFormationMatchup(homeCtx,awayCtx);

applyTrainerImpact(homeCtx, homeCoach);
applyTrainerImpact(awayCtx, awayCoach);

applyTrainerPersonality(homeCtx, homeCoach);
applyTrainerPersonality(awayCtx, awayCoach);

const state = createInitialState(homeCtx.players,awayCtx.players);

/* COACH TACTICS */
applyCoachTactics(homeCtx, homeCoach)
applyCoachTactics(awayCtx, awayCoach)

state.matchImportance = calculateMatchImportance(homeTeam,awayTeam,match)

state.temperature *= state.matchImportance


state.crowdPressure = calculateCrowdPressure(homeTeam)

state.homeCtx = homeCtx;
state.awayCtx = awayCtx;

/* ======================================================
MATCH LOOP
====================================================== */

for(let tick = 0; tick < 360; tick++){

state.minute = Math.floor(tick / 4) + 1


applyTrainerGameManagement(state, homeCtx, homeCoach)
applyTrainerGameManagement(state, awayCtx, awayCoach)



updateMatchRhythm(state,homeCtx,awayCtx)

applyTrainerSubstitutions(state,homeCtx);
applyTrainerSubstitutions(state,awayCtx);


// Reset der temporären Stärke (verhindert Multiplikations‑Stacking)
homeCtx.baseAttack = homeCtx.baseAttack || homeCtx.attackStrength
homeCtx.baseDefense = homeCtx.baseDefense || homeCtx.defenseStrength

awayCtx.baseAttack = awayCtx.baseAttack || awayCtx.attackStrength
awayCtx.baseDefense = awayCtx.baseDefense || awayCtx.defenseStrength

homeCtx.attackStrength = homeCtx.baseAttack
homeCtx.defenseStrength = homeCtx.baseDefense
homeCtx.possessionSkill = homeCtx.possessionSkill || 50

awayCtx.attackStrength = awayCtx.baseAttack
awayCtx.defenseStrength = awayCtx.baseDefense
awayCtx.possessionSkill = awayCtx.possessionSkill || 50

// SAFETY GUARD

if(!Number.isFinite(homeCtx.attackStrength)) homeCtx.attackStrength = 50
if(!Number.isFinite(homeCtx.defenseStrength)) homeCtx.defenseStrength = 50
if(!Number.isFinite(homeCtx.possessionSkill)) homeCtx.possessionSkill = 50

if(!Number.isFinite(awayCtx.attackStrength)) awayCtx.attackStrength = 50
if(!Number.isFinite(awayCtx.defenseStrength)) awayCtx.defenseStrength = 50
if(!Number.isFinite(awayCtx.possessionSkill)) awayCtx.possessionSkill = 50



/* NEU */

applyTrainerAdaptation(state,homeCtx,awayCtx,homeCoach);
applyTrainerAdaptation(state,awayCtx,homeCtx,awayCoach);

applyDynamicTacticalAdjustments(state,homeCtx,awayCtx)
applyDynamicTacticalAdjustments(state,awayCtx,homeCtx)

applyManagerDecisions(state,homeCtx,awayCtx)
applyManagerDecisions(state,awayCtx,homeCtx)

applyFormationShift(state,homeCtx)
applyFormationShift(state,awayCtx)

applyInGameTacticalAdjustments(state,homeCtx,awayCtx)
applyInGameTacticalAdjustments(state,awayCtx,homeCtx)

applyDefensiveBlock(homeCtx, state)
applyDefensiveBlock(awayCtx, state)

applyGameStateIntelligence(state,homeCtx)
applyGameStateIntelligence(state,awayCtx)

homeCtx.defensiveLine = applyDefensiveLine(homeCtx,state)
awayCtx.defensiveLine = applyDefensiveLine(awayCtx,state)

homeCtx.lineModifier = getDefensiveLineModifiers(homeCtx.defensiveLine)
awayCtx.lineModifier = getDefensiveLineModifiers(awayCtx.defensiveLine)

applyTacticImpact(homeCtx,state);
applyTacticImpact(awayCtx,state);

// Pressing einmal pro Minute berechnen
state.homePress = applyPressingEffect(homeCtx,awayCtx)
state.awayPress = applyPressingEffect(awayCtx,homeCtx)

state.homePress.attackModifier *= homeCtx.blockModifier.press
state.homePress.turnoverModifier *= homeCtx.blockModifier.press

state.awayPress.attackModifier *= awayCtx.blockModifier.press
state.awayPress.turnoverModifier *= awayCtx.blockModifier.press

const homeDNA = homeCtx.dynamicDNA || homeCtx.coachDNA
const awayDNA = awayCtx.dynamicDNA || awayCtx.coachDNA

state.homePress.attackModifier *=
homeDNA.pressing * (homeCtx.pressModifier || 1)

state.homePress.turnoverModifier *=
homeDNA.pressing * (homeCtx.pressModifier || 1)

state.awayPress.attackModifier *=
awayDNA.pressing * (awayCtx.pressModifier || 1)

state.awayPress.turnoverModifier *=
awayDNA.pressing * (awayCtx.pressModifier || 1)



/* SHAPES VOR DER MINUTE */
state.homeShape = applyDefensiveShape(homeCtx)
state.awayShape = applyDefensiveShape(awayCtx)

movePlayers(homeCtx,state)
movePlayers(awayCtx,state)

await simulateMinute(state,homeCtx,awayCtx);

if(process.env.DEBUG_MATCH){
console.log("Minute", state.minute)
}

state.momentum.home *= 0.98;
state.momentum.away *= 0.98;

state.homeOverload = applyOverloadEffect(homeCtx,awayCtx)
state.awayOverload = applyOverloadEffect(awayCtx,homeCtx)

}

/* ======================================================
STATS
====================================================== */

const possession = calculatePossession(state);
const ratings = calculateRatings(state);

/* ======================================================
FITNESS
====================================================== */

for(const p of [...homeCtx.players, ...awayCtx.players]){

const loss = 6 + Math.random()*4

state.fitnessUpdates.push({
playerId: p._id,
loss
})

}

/* ======================================================
PLAYER DEVELOPMENT
====================================================== */

homeCtx.players.forEach(player => {
applyPlayerDevelopment(player, homeCoach)
})

awayCtx.players.forEach(player => {
applyPlayerDevelopment(player, awayCoach)
})


/* ======================================================
NEWS
====================================================== */

if(match && process.env.TEST_MODE !== "true"){

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

fieldTilt: calculateFieldTilt(state),

possession,
stats:buildStats(state),
events:state.events,
ratings,

shotMap: state.shotMap,

zoneStats: state.zoneStats,

narrative: generateMatchNarrative(state),

debug: state.debug

};

}

module.exports = { simulateRealisticMatch };

// ======================================================
// TEAM CONTEXT HELPERS
// ======================================================


function calculatePossessionStrength(ctx){

let strength =
ctx.possessionSkill * 0.6 +
ctx.attackStrength * 0.2 +
ctx.defenseStrength * 0.2

switch(ctx.style){

case "possession":
strength *= 1.25
break

case "gegenpress":
strength *= 1.10
break

case "counter":
strength *= 0.90
break

case "parkbus":
strength *= 0.75
break

case "longball":
strength *= 0.85
break

}

return strength
}

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

attackStrength: Number.isFinite(team.attackStrength) ? team.attackStrength : 50,
defenseStrength: Number.isFinite(team.defenseStrength) ? team.defenseStrength : 50,
possessionSkill: Number.isFinite(team.possessionSkill) ? team.possessionSkill : 50,


style: team.tacticalStyle ||
team.coach?.philosophy ||
"balanced"
};

ctx.coachDNA = team.coachDNA || {
tempo:1,
pressing:1,
width:1,
directness:1,
risk:1
}

// Coach Rating Impact

const stars = team.coach?.stars || 3

ctx.coachImpact =
1 + (stars - 3) * 0.05

ctx.attackStrength *= ctx.coachImpact
ctx.defenseStrength *= ctx.coachImpact


ctx.possessionStrength = calculatePossessionStrength(ctx)

ctx.zones = calculateZoneStrength(ctx)

ctx.defenders = players.filter(p =>
p.positions?.includes("CB") ||
p.positions?.includes("LB") ||
p.positions?.includes("RB") ||
p.positions?.includes("CDM")
)

if(isHome && team.homeBonus){

ctx.attackStrength *= team.homeBonus;
ctx.defenseStrength *= team.homeBonus;

}
// SAFETY GUARD gegen NaN

if(!Number.isFinite(ctx.attackStrength)) ctx.attackStrength = 50
if(!Number.isFinite(ctx.defenseStrength)) ctx.defenseStrength = 50
if(!Number.isFinite(ctx.possessionSkill)) ctx.possessionSkill = 50

return ctx;

}

function calculateZoneStrength(teamCtx){

const zones = {
wing_left:0,
halfspace_left:0,
center:0,
halfspace_right:0,
wing_right:0
}

for(const p of teamCtx.players){

if(p.positions?.includes("LW")){
zones.wing_left += 2
zones.halfspace_left += 1
}

if(p.positions?.includes("RW")){
zones.wing_right += 2
zones.halfspace_right += 1
}

if(p.positions?.includes("CAM")){
zones.halfspace_left += 2
zones.halfspace_right += 2
zones.center += 2
}

if(p.positions?.includes("CM")){
zones.center += 2
zones.halfspace_left += 1
zones.halfspace_right += 1
}

if(p.positions?.includes("ST")){
zones.center += 2
}

if(p.positions?.includes("LB")){
zones.wing_left += 1
}

if(p.positions?.includes("RB")){
zones.wing_right += 1
}

}

return zones
}


// ======================================================
// MATCH STATE
// ======================================================

function createInitialState(homePlayers,awayPlayers){

const referee = generateReferee()

return{

debug:{
attacks:0,
buildUpFail:0,
progressionFail:0,
finalThird:0,
shots:0,
goals:0
},

zoneStats:{
shots:{},
goals:{},
xG:{}
},

dangerousPossessions:{
home:0,
away:0
},

touchesInBox:{
home:0,
away:0
},

bigChances:{
home:0,
away:0
},

attackBudget:0,
attackBudgetMax:0,

minute:0,

homeShape:{
progressModifier:1,
shotSuppression:1,
turnoverModifier:1
},

awayShape:{
progressModifier:1,
shotSuppression:1,
turnoverModifier:1
},

homeOverload:{ attackBonus:1, chanceBonus:1 },
awayOverload:{ attackBonus:1, chanceBonus:1 },

events:[

{
minute:0,
type:"referee",
style: referee.name
}
],
playerStats:{},

shotMap:{
home:[],
away:[]
},

temperature: generateMatchTemperature(),

referee: referee,

momentum:{
home:0,
away:0
},

fitnessUpdates:[],

injuries:[],

rhythm:{
phase:"balanced",
timer:0
},
home:baseTeamState(),
away:baseTeamState(),

territory:{
home:0,
away:0
},

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

function generateMatchTemperature(){

let base = Math.random()

// normale Spiele
if(base < 0.60){
return 1
}

// intensivere Spiele
if(base < 0.85){
return 1.25
}

// hitzige Spiele
return 1.6

}

function updateMatchRhythm(state){

if(state.rhythm.timer > 0){
state.rhythm.timer--
return
}

const r = Math.random()

if(r < 0.20){
state.rhythm.phase = "home_pressure"
state.rhythm.timer = 6 + Math.floor(Math.random()*6)
}
else if(r < 0.40){
state.rhythm.phase = "away_pressure"
state.rhythm.timer = 6 + Math.floor(Math.random()*6)
}
else if(r < 0.60){
state.rhythm.phase = "counter_phase"
state.rhythm.timer = 5 + Math.floor(Math.random()*5)
}
else if(r < 0.80){
state.rhythm.phase = "balanced"
state.rhythm.timer = 5 + Math.floor(Math.random()*6)
}
else{
state.rhythm.phase = "chaos"
state.rhythm.timer = 3 + Math.floor(Math.random()*4)
}

}

function getFatigueModifier(player){

const fitness = player?.fitness ?? 100

// Frisch
if(fitness >= 90) return 1

// leicht müde
if(fitness >= 75) return 0.96

// deutlich müde
if(fitness >= 60) return 0.90

// sehr müde
if(fitness >= 45) return 0.82

// komplett platt
return 0.72

}

function getTeamFatigueModifier(players){

if(!players || players.length === 0) return 1

let total = 0

for(const p of players){
total += getFatigueModifier(p)
}

return total / players.length

}

function applyInGameTacticalAdjustments(state, ctx, opponentCtx){

const scoreDiff =
(ctx === state.homeCtx)
? state.home.goals - state.away.goals
: state.away.goals - state.home.goals

let attackMod = 1
let defenseMod = 1

// Team liegt zurück
if(scoreDiff < 0){

attackMod *= 1.15
defenseMod *= 0.92

}

// Team führt
if(scoreDiff > 0){

attackMod *= 0.92
defenseMod *= 1.10

}

// späte Phase → mehr Risiko
if(state.minute >= 75 && scoreDiff <= 0){

attackMod *= 1.20

}

// Dominanzphase → Gegner kontert mehr
if(state.rhythm.phase === "home_pressure" && ctx === state.awayCtx){
attackMod *= 1.08
}

if(state.rhythm.phase === "away_pressure" && ctx === state.homeCtx){
attackMod *= 1.08
}

ctx.attackStrength *= attackMod
ctx.defenseStrength *= defenseMod

}

function applyGameStateIntelligence(state, ctx){

let attackMod = 1
let defenseMod = 1

const isHome = ctx === state.homeCtx

const goalsFor = isHome ? state.home.goals : state.away.goals
const goalsAgainst = isHome ? state.away.goals : state.home.goals

const diff = goalsFor - goalsAgainst

// Rückstand → offensiver
if(diff < 0){

attackMod *= 1.18
defenseMod *= 0.94

}

// Führung → defensiver
if(diff > 0){
attackMod *= 0.97
defenseMod *= 1.08
}


// späte Aufholphase
if(state.minute > 80 && diff < 0){

attackMod *= 1.30

}

// späte Führung sichern
if(state.minute > 80 && diff > 0){

defenseMod *= 1.20

}

ctx.attackStrength *= attackMod
ctx.defenseStrength *= defenseMod

}

function generateReferee(){

const types = [

{
name:"strict",
yellowModifier:1.6,
redModifier:1.4
},

{
name:"balanced",
yellowModifier:1,
redModifier:1
},

{
name:"lenient",
yellowModifier:0.7,
redModifier:0.6
}

]

return types[Math.floor(Math.random()*types.length)]

}

function calculateCrowdPressure(homeTeam){

const capacity = homeTeam.stadiumCapacity || 20000
const attendance = homeTeam.attendance || capacity * 0.85

let pressure = attendance / capacity

// große Stadien erzeugen mehr Druck
if(capacity > 60000) pressure *= 1.15
if(capacity > 80000) pressure *= 1.25

// Fan‑Kultur Bonus
if(homeTeam.fanCulture === "true_love" || homeTeam.fanCulture === true){
pressure *= 1.10
}

return Math.min(1.6, pressure)

}

function calculateMatchImportance(homeTeam, awayTeam, match){

let importance = 1

// Pokalspiele wichtiger
if(match?.type === "cup"){
importance *= 1.15
}

// Finale / Halbfinale
if(match?.stage === "final" || match?.stage === "semi_final"){
importance *= 1.25
}

// Tabellenkonkurrenten
if(
homeTeam.leaguePosition &&
awayTeam.leaguePosition &&
Math.abs(homeTeam.leaguePosition - awayTeam.leaguePosition) <= 2
){
importance *= 1.10
}

// Spitzenspiel
if(
homeTeam.leaguePosition <= 4 &&
awayTeam.leaguePosition <= 4
){
importance *= 1.15
}

return importance
}

// ======================================================
// MATCH FLOW
// ======================================================

async function simulateMinute(state,homeCtx,awayCtx){

/* Chance dass überhaupt ein Angriff entsteht */

let tempo =
(getTempoModifier(homeCtx) + getTempoModifier(awayCtx)) / 2

// Trainer Game Management
tempo *= homeCtx.gamePlan?.tempo || 1
tempo *= awayCtx.gamePlan?.tempo || 1

const homeIdentity = homeCtx.trainerIdentity || {}
const awayIdentity = awayCtx.trainerIdentity || {}

tempo *= homeIdentity.tempo || 1
tempo *= awayIdentity.tempo || 1


const homeDNA = homeCtx.dynamicDNA || homeCtx.coachDNA
const awayDNA = awayCtx.dynamicDNA || awayCtx.coachDNA

tempo *=
(homeDNA.tempo * homeCtx.tempoModifier +
awayDNA.tempo * awayCtx.tempoModifier) / 2


tempo *=
(getAttackVolumeModifier(homeCtx) +
getAttackVolumeModifier(awayCtx)) / 2

// Attack Volume System (taktikabhängig)

const volume =
(getAttackVolumeModifier(homeCtx) +
getAttackVolumeModifier(awayCtx)) / 2

tempo *= applyDynamicTempo(state, homeCtx)
tempo *= applyDynamicTempo(state, awayCtx)

tempo *= applyGameManagement(state, homeCtx)
tempo *= applyGameManagement(state, awayCtx)
tempo *= applyMatchFlowProbability(state)

// Dynamic Match Phases beeinflussen Spieltempo

switch(state.rhythm.phase){

case "home_pressure":
tempo *= 1.25
break

case "away_pressure":
tempo *= 1.25
break

case "counter_phase":
tempo *= 1.15
break

case "chaos":
tempo *= 1.35
break

case "balanced":
tempo *= 1
break

}

tempo *= homeCtx.identity?.tempoBias || 1
tempo *= awayCtx.identity?.tempoBias || 1

tempo *= homeCtx.trainerStructure?.tempo || 1
tempo *= awayCtx.trainerStructure?.tempo || 1

tempo = Math.max(0.9, Math.min(1.6, tempo))
const attackProbability = 0.25 * tempo







if(Math.random() > attackProbability){
  return;
}




const totalPossession =
(homeCtx.possessionStrength + awayCtx.possessionStrength) || 1

const homeShare = homeCtx.possessionStrength / totalPossession
const awayShare = awayCtx.possessionStrength / totalPossession

state.home.control += homeShare
state.away.control += awayShare

const homeMomentum = 1 + clampMomentum(state.momentum.home);
const awayMomentum = 1 + clampMomentum(state.momentum.away);

// Heimfans pushen Momentum
if(state.crowdPressure){

state.momentum.home += 0.0004 * state.crowdPressure
state.momentum.away -= 0.00035 * state.crowdPressure

}

const homeOverload = state.homeOverload || { attackBonus: 1, chanceBonus: 1 }
const awayOverload = state.awayOverload || { attackBonus: 1, chanceBonus: 1 }

const homeStyle = applyTacticalStyle(homeCtx)
const awayStyle = applyTacticalStyle(awayCtx)

const homeFatigue = getTeamFatigueModifier(homeCtx.players)
const awayFatigue = getTeamFatigueModifier(awayCtx.players)

const homePressing = {
attackModifier: state.homePress?.attackModifier ?? 1,
turnoverModifier: state.homePress?.turnoverModifier ?? 1
}

const awayPressing = {
attackModifier: state.awayPress?.attackModifier ?? 1,
turnoverModifier: state.awayPress?.turnoverModifier ?? 1
}


let homeAttack =
homeCtx.attackStrength *
homeStyle.attack *
homeMomentum *
homePressing.attackModifier *
(homeOverload?.attackBonus || 1) *
homeFatigue

let awayAttack =
awayCtx.attackStrength *
awayStyle.attack *
awayMomentum *
awayPressing.attackModifier *
(awayOverload?.attackBonus || 1) *
awayFatigue

// Trainer Risiko Anpassung
homeAttack *= homeCtx.gamePlan?.risk || 1
awayAttack *= awayCtx.gamePlan?.risk || 1

homeAttack *= homeIdentity.risk || 1
awayAttack *= awayIdentity.risk || 1



const homeShape = state.homeShape || {
progressModifier:1,
shotSuppression:1,
turnoverModifier:1
}

const awayShape = state.awayShape || {
progressModifier:1,
shotSuppression:1,
turnoverModifier:1
}

let homeDefense =
homeCtx.defenseStrength * (homeShape.progressModifier || 1)

let awayDefense =
awayCtx.defenseStrength * (awayShape.progressModifier || 1)

// Safety Guard gegen 0 / negative Werte
if(homeDefense <= 0) homeDefense = 1
if(awayDefense <= 0) awayDefense = 1

let homePower = homeAttack / awayDefense
let awayPower = awayAttack / homeDefense

// Schutz gegen NaN / Infinity
if(!Number.isFinite(homePower)) homePower = 1
if(!Number.isFinite(awayPower)) awayPower = 1

const denom = (homePower + awayPower) || 1

let homeChance = homePower / denom
let awayChance = awayPower / denom

if(state.rhythm.phase === "home_pressure"){
homeChance *= 1.35
awayChance *= 0.75
}

if(state.rhythm.phase === "away_pressure"){
awayChance *= 1.35
homeChance *= 0.75
}

if(state.rhythm.phase === "counter_phase"){
homeChance *= 1.10
awayChance *= 1.10
}

if(state.rhythm.phase === "chaos"){
homeChance *= 1.20
awayChance *= 1.20
}

const totalChance = (homeChance + awayChance) || 1

let finalHomeChance = homeChance / totalChance

if(!Number.isFinite(finalHomeChance) || finalHomeChance < 0 || finalHomeChance > 1){
finalHomeChance = 0.5
}

const isHomeAttack = Math.random() < finalHomeChance
state.debug.attacks++

const attacking = isHomeAttack ? state.home : state.away;

// TERRITORY CONTROL

if(isHomeAttack){
state.territory.home += 1
}else{
state.territory.away += 1
}

const defending = isHomeAttack ? state.away : state.home;

const attackCtx = isHomeAttack ? homeCtx : awayCtx;
const defendCtx = isHomeAttack ? awayCtx : homeCtx;
const isHome = attacking === state.home

if(process.env.DEBUG_MATCH){
console.log("Attack triggered")
}

// Chance auf Standard
if(trySetPiece(state,attacking,defending,attackCtx,defendCtx)){
return
}

runAttackFlow(state,attacking,defending,attackCtx,defendCtx);

maybeYellow(state,defending);
maybeRed(state,defending);
await maybeInjury(state,attacking);

}

function handleSubstitutions(state,ctx){

if(state.minute < 70) return;
if(state.minute > 85) return;

if(Math.random() > 0.08) return;

const players = ctx.players;

const tiredPlayers = players.filter(p => (p.fitness || 100) < 70);

if(tiredPlayers.length === 0) return;

const outPlayer = tiredPlayers[Math.floor(Math.random()*tiredPlayers.length)];

const bench = (ctx.bench || []).filter(p =>
(p.positions || []).some(pos =>
outPlayer.positions?.includes(pos)
)
)

if(bench.length === 0) return;

const sub = bench[Math.floor(Math.random()*bench.length)];

ctx.players = ctx.players.map(p =>
p._id.toString() === outPlayer._id.toString() ? sub : p
)

ctx.bench = ctx.bench.filter(p =>
p._id.toString() !== sub._id.toString()
)

ctx.bench.push(outPlayer)

state.events.push({
minute:state.minute,
type:"substitution",
out:`${outPlayer.firstName} ${outPlayer.lastName}`,
in:`${sub.firstName} ${sub.lastName}`
});

}

function runAttackFlow(state,attacking,defending,attackCtx,defendCtx){

// Defensive Mistake Check
const defenders = defendCtx.defenders

const defender = pickRandom(defenders)

const mistake = defensiveMistake(defender)

if(mistake){

state.events.push({
minute:state.minute,
type:"defensive_error",
error:mistake,
player:`${defender.firstName} ${defender.lastName}`
})

finalThirdPhase(state,attacking,defending,attackCtx,defendCtx)
return
}

if(!buildUpPhase(state,attacking,defending,attackCtx,defendCtx)){

if(Math.random() < 0.35){
tryCounterAttack(state,defending,attacking,defendCtx,attackCtx)
}

return;
}

if(!progressionPhase(state,attacking,defending,attackCtx,defendCtx)){
return;
}

if(!possessionChain(state,attacking,defending,attackCtx,defendCtx)){
return;
}

finalThirdPhase(state,attacking,defending,attackCtx,defendCtx);

}


function tryCounterAttack(state,defending,attacking,defCtx,atkCtx){

const restDefense = defCtx.shape?.restDefense || 2

let counterChance =
0.18 +
(3 - restDefense) * 0.05



if(defCtx.style === "counter"){
counterChance += 0.15
}

if(Math.random() > counterChance){
return false
}

state.events.push({
minute:state.minute,
type:"counter_attack"
})

finalThirdPhase(state,defending,attacking,defCtx,atkCtx)

return true

}

function trySetPiece(state,attacking,defending,attackCtx,defendCtx){

let r = Math.random()

if(r < 0.03){
return takeCorner(state,attacking,defending,attackCtx,defendCtx)
}

if(r < 0.05){
return takeFreeKick(state,attacking,defending,attackCtx,defendCtx)
}

if(r < 0.052){
return takePenalty(state,attacking,defending,attackCtx,defendCtx)
}

return false

}

function takeCorner(state,attacking,defending,attackCtx,defendCtx){

state.events.push({
minute:state.minute,
type:"corner"
})

const attackers = attackCtx.players.filter(p =>
p.positions?.includes("CB") ||
p.positions?.includes("ST")
)

const attacker = pickAttacker(
attackers.length ? attackers : attackCtx.players
);

const zone = "center"

const coverageModifier =
applyDefensiveCoverage(defendCtx)

const spatialModifier =
applySpatialAwareness(attacker, attackCtx, defendCtx)

const rotationModifier =
applyDefensiveRotation(defendCtx, zone)

const markingModifier = applyMarking(attacker, defendCtx)

const defenders = defendCtx.defenders

const duel = headingDuel(attacker,defenders)

let xG =
0.06 *
duel *
markingModifier *
spatialModifier *
coverageModifier *
rotationModifier

attacking.shots++
attacking.xG += xG

if(Math.random() < xG){

attacking.goals++
state.debug.goals++

state.events.push({
minute:state.minute,
type:"goal",
scorer:`${attacker.firstName} ${attacker.lastName}`,
setPiece:"corner"
})

addStat(state,attacker._id,"goals")

}

return true

}

function takeFreeKick(state,attacking,defending,attackCtx,defendCtx){

state.events.push({
minute:state.minute,
type:"free_kick"
})

const shooter = pickWeightedCreator(attackCtx.players)

let skill =
(shooter.shooting || 50) * 0.6 +
(shooter.passing || 50) * 0.4

let xG = 0.025 + (skill / 1400)

attacking.shots++
attacking.xG += xG

if(Math.random() < xG){

attacking.goals++
state.debug.goals++

state.events.push({
minute:state.minute,
type:"goal",
scorer:`${shooter.firstName} ${shooter.lastName}`,
setPiece:"free_kick"
})

addStat(state,shooter._id,"goals")

}

return true

}

function takePenalty(state,attacking,defending,attackCtx,defendCtx){

state.events.push({
minute:state.minute,
type:"penalty_awarded"
})

const taker = pickAttacker(attackCtx.players)

let finishing = taker.shooting || 50
let xG = 0.74 + (finishing / 1400)

attacking.shots++
attacking.xG += xG

if(Math.random() < xG){

attacking.goals++
state.debug.goals++

state.events.push({
minute:state.minute,
type:"goal",
scorer:`${taker.firstName} ${taker.lastName}`,
setPiece:"penalty"
})

addStat(state,taker._id,"goals")

}else{

state.events.push({
minute:state.minute,
type:"penalty_missed",
player:`${taker.firstName} ${taker.lastName}`
})

}

return true

}

const PITCH_ZONES = [
"wing_left",
"halfspace_left",
"center",
"halfspace_right",
"wing_right"
]

const XT_GRID = {

wing_left: 0.04,
wing_right: 0.04,

halfspace_left: 0.10,
halfspace_right: 0.10,

center: 0.16,

long: 0.02,

close: 0.32

}

const PV_GRID = {

wing_left: 0.05,
wing_right: 0.05,

halfspace_left: 0.12,
halfspace_right: 0.12,

center: 0.18,

long: 0.03,

close: 0.35

}

function chooseAttackZone(attackCtx,defendCtx){

const identity = attackCtx.identity || {}
const width = attackCtx.widthModifier || 1

if(width > 1.15){
return Math.random() < 0.5 ? "wing_left" : "wing_right"
}

// moderne Teams attackieren häufiger Halbräume
if(Math.random() < 0.25){
return Math.random() < 0.5
? "halfspace_left"
: "halfspace_right"
}

if(Math.random() < 0.65 * width){
return chooseZoneByStrength(attackCtx,defendCtx)
}

if(identity.wingBias && Math.random() < 0.25 * identity.wingBias){
return Math.random() < 0.5 ? "wing_left" : "wing_right"
}

if(identity.centralBias && Math.random() < 0.25 * identity.centralBias){
return "center"
}

return PITCH_ZONES[Math.floor(Math.random()*PITCH_ZONES.length)]

}


function defensiveMistake(defender){

let errorChance = 0.015

// Müdigkeit erhöht Fehler
if(defender?.fitness){
errorChance += (100 - defender.fitness) * 0.0004
}

// schwache Verteidiger machen mehr Fehler
errorChance += Math.max(-0.01,
(50 - (defender?.defending || 50)) * 0.0005)

errorChance += Math.max(-0.005,
(50 - (defender?.mentality || 50)) * 0.0005)

if(Math.random() > errorChance){
return null
}

const errors = [
"bad_pass",
"missed_tackle",
"slip",
"deflection",
"goalkeeper_error"
]

return errors[Math.floor(Math.random()*errors.length)]

}

function chooseZoneByStrength(attackCtx,defendCtx){

let bestZone = "center"
let bestScore = -Infinity

for(const zone of PITCH_ZONES){

const atk = attackCtx.zones?.[zone] || 1
const def = defendCtx.zones?.[zone] || 1

const score = atk / def

if(score > bestScore){
bestScore = score
bestZone = zone
}

}

return bestZone
}

// ======================================================
// BUILD UP
// ======================================================

function buildUpPhase(state,attacking,defending,attackCtx,defendCtx){

if(process.env.DEBUG_BUILDUP){
console.log("BUILDUP START", {
possession: attackCtx.possessionSkill,
defense: defendCtx.defenseStrength
})
}


const press =
attackCtx === state.homeCtx
? state.awayPress
: state.homePress

const shape =
attackCtx === state.homeCtx
? state.awayShape
: state.homeShape

const ballPlayer = pickWeightedCreator(attackCtx.players)

const pressResistance =
applyPressResistance(ballPlayer, press.turnoverModifier)

let buildChance =
0.72 +
(attackCtx.possessionSkill - defendCtx.defenseStrength) / 280



buildChance *= attackCtx.buildUpModifier || 1


buildChance *= press.turnoverModifier
buildChance *= shape.turnoverModifier
buildChance /= defendCtx.coachDNA.pressing

// realistischer BuildUp
buildChance *= 1.05 * attackCtx.coachImpact



if(process.env.DEBUG_BUILDUP){
console.log("BUILDUP CHANCE", buildChance)
}


if(Math.random() > buildChance)
{

attacking.turnovers++
state.debug.buildUpFail++

return false

}

return true
}

function progressionPhase(state,attacking,defending,attackCtx,defendCtx){

let shapeBonus =
1 + (attackCtx.shape.attackers - defendCtx.shape.restDefense) * 0.05

let progressChance =
0.60 +
(attackCtx.attackStrength - defendCtx.defenseStrength) / 300




const overload =
attackCtx === state.homeCtx
? state.homeOverload
: state.awayOverload

const overlap = applyWingBackOverlap(attackCtx)

progressChance *= overload.attackBonus * attackCtx.coachImpact
progressChance *= overlap
progressChance *=
(defendCtx.lineModifier?.progressModifier || 1) *
(defendCtx.blockModifier?.progress || 1)

if(process.env.DEBUG_PROGRESSION){
console.log("PROGRESSION CHANCE", progressChance)
}


if(Math.random() > progressChance)
{

attacking.turnovers++;
state.debug.progressionFail++;
return false;
}

return true;
}



function possessionChain(state, attacking, defending, attackCtx, defendCtx){

const xt = runXTChain(state, attackCtx, defendCtx)

if(xt.success){

state.lastXT = xt.xT
state.lastZone = xt.zone

return true

}



    const zone = chooseAttackZone(attackCtx,defendCtx)
const isHomeAttack = attackCtx === state.homeCtx

if(zone === "center" || zone === "halfspace_left" || zone === "halfspace_right"){

if(isHomeAttack){
state.dangerousPossessions.home++
}else{
state.dangerousPossessions.away++
}

}
const zonePV = getPossessionValue(zone)

let passes = 0
let basePasses = 2 + Math.floor(Math.random()*4)

const dna = attackCtx.dynamicDNA || attackCtx.coachDNA

let maxPasses =
basePasses *
(dna.tempo || 1) *
(2 - (dna.directness || 1)) *
(attackCtx.shape.midfield / 3)


while(passes < maxPasses){

passes++

let actionRoll = Math.random()

if(actionRoll < 0.55){

const passer =
attackCtx.players[Math.floor(Math.random()*attackCtx.players.length)]

const receiver = choosePassTarget(
passer,
attackCtx
)

if(receiver){

const passerPos = attackCtx.positions[passer._id]
const targetPos = attackCtx.positions[receiver._id]

// PASSWEG BLOCKIERT?
if(passingLaneBlocked(passerPos,targetPos,defendCtx)){
attacking.turnovers++
return false
}

const pressure = calculatePassPressure(targetPos, defendCtx)

if(Math.random() < 0.15 * pressure){
attacking.turnovers++
return false
}

if(process.env.DEBUG_MATCH){
    state.events.push({
        minute:state.minute,
        type:"pass_combination",
        player:`${receiver.firstName} ${receiver.lastName}`
    })
}



if(Math.random() < 0.25){
attacking.keyPasses++
}

if(Math.random() < 0.02 + zonePV * 0.12){
return true
}



}
}
else if(actionRoll < 0.75){

attacking.dribbles++

if(Math.random() < 0.18){
return true
}

}
else{

attacking.crosses++

if(Math.random() < 0.25){
return true
}

}

if(Math.random() < 0.08){

attacking.turnovers++
return false

}

}

return true

}

function finalThirdPhase(state,attacking,defending,attackCtx,defendCtx){
state.debug.finalThird++

const zone = chooseAttackZone(attackCtx,defendCtx)

// Possession Value der Zone
const zonePV = getPossessionValue(zone)

const rotationModifier =
applyDefensiveRotation(defendCtx, zone)

let creator = pickWeightedCreator(attackCtx.players)
if(!creator) return

const action = decideAction(creator, attackCtx, defendCtx, state)

// gute Zonen erhöhen Risiko für Abschluss
let pvModifier = 1 + zonePV * 1.5

if(action === "dribble"){
attacking.dribbles++
finishPhase(state,attacking,defending,attackCtx,defendCtx,creator,zone)
return
}

if(action === "cross"){
attacking.crosses++
finishPhase(state,attacking,defending,attackCtx,defendCtx,creator,zone)
return
}

if(action === "pass"){

const passRisk = applyPassRisk(creator, zone)

if(Math.random() < passRisk.turnover){

attacking.turnovers++

state.events.push({
minute:state.minute,
type:"intercepted_pass"
})

return

}

attacking.keyPasses++

finishPhase(state,attacking,defending,attackCtx,defendCtx,creator,zone)

return
}

if(action === "shoot"){
finishPhase(state,attacking,defending,attackCtx,defendCtx,creator,zone)
return
}

}

function determineAssistChain(players, creator, attacker){

let assist = null
let preAssist = null

if(!creator) return {assist:null, preAssist:null}

if(creator._id.toString() !== attacker._id.toString()){
assist = creator
}

// zufälliger Pre‑Assist aus kreativen Spielern
if(assist && Math.random() < 0.35){

const candidates = players.filter(p =>
p._id.toString() !== attacker._id.toString() &&
p._id.toString() !== creator._id.toString() &&
(
p.positions?.includes("CM") ||
p.positions?.includes("CAM") ||
p.positions?.includes("LW") ||
p.positions?.includes("RW")
)
)

if(candidates.length){

const weighted = []

for(const p of candidates){

let weight = 1

if(
p.positions?.includes("CAM") ||
p.positions?.includes("CM")
){
weight += 2
}

if(p.playstyles?.includes("playmaker")){
weight += 3
}

for(let i=0;i<weight;i++){
weighted.push(p)
}

}

preAssist = weighted[Math.floor(Math.random()*weighted.length)]

}

}

return {assist,preAssist}

}

function determineChanceType(creator, zone, attackCtx, defendCtx){

let r = Math.random()

// Flügel
if(zone === "wing_left" || zone === "wing_right"){
if(r < 0.45) return "cross"
if(r < 0.75) return "cutback"
return "dribble"
}

// Halbraum
if(zone === "halfspace_left" || zone === "halfspace_right"){
const lineMod = defendCtx.lineModifier?.throughBallBonus || 1

if(Math.random() < 0.55 * lineMod * attackCtx.coachDNA.directness)
return "through_ball"
if(r < 0.80) return "dribble"
return "long_shot"
}

// Zentrum
if(r < 0.40) return "through_ball"
if(r < 0.70) return "dribble"
return "long_shot"

}

function determineShotBodyPart(attacker, zone){

let r = Math.random()

// Flanken erzeugen mehr Kopfbälle
if(zone === "wing_left" || zone === "wing_right"){

if(r < 0.45) return "header"
if(r < 0.70) return "volley"
return "right_foot"

}

// Halbräume

if(zone === "halfspace_left" || zone === "halfspace_right"){

if(r < 0.20) return "left_foot"
if(r < 0.35) return "volley"
return "right_foot"

}

// Zentrum

if(r < 0.10) return "tap_in"
if(r < 0.25) return "left_foot"
if(r < 0.35) return "header"
return "right_foot"

}

// ======================================================
// FINISH PHASE
// ======================================================

function finishPhase(state,attacking,defending,attackCtx,defendCtx,creator,zone){

const zonePV = getPossessionValue(zone)

const isHomeShot = attackCtx === state.homeCtx

const attackers = attackCtx.players.filter(p =>
p.positions?.includes("ST") ||
p.positions?.includes("LW") ||
p.positions?.includes("RW") ||
p.positions?.includes("CAM")
);

const attacker = pickAttacker(
attackers.length ? attackers : attackCtx.players
);

if(!attacker) return;

const coverageModifier =
applyDefensiveCoverage(defendCtx)

const spatialModifier =
applySpatialAwareness(attacker, attackCtx, defendCtx)

const rotationModifier =
applyDefensiveRotation(defendCtx, zone)

const goalkeeper = defendCtx.goalkeeper;

const chanceType = determineChanceType(creator, zone, attackCtx, defendCtx)

if(applyOffsideTrap(defendCtx, chanceType)){

state.events.push({
minute:state.minute,
type:"offside"
})

return
}

let crossType = "cross"

if(zone === "wing_left" || zone === "wing_right"){

const r = Math.random()

if(r < 0.25){
crossType = "cutback"
}
else if(r < 0.80){
crossType = "cross"
}
else{
crossType = "dribble"
}

state.events.push({
minute:state.minute,
type: crossType,
player:`${creator.firstName} ${creator.lastName}`
})

}

const bodyPart = determineShotBodyPart(attacker, zone)

let shotZone

if(zone === "wing_left" || zone === "wing_right"){

if(Math.random() < 0.45) shotZone = "center"
else if(Math.random() < 0.75) shotZone = "halfspace_left"
else shotZone = "long"

}

else if(zone === "halfspace_left" || zone === "halfspace_right"){

if(Math.random() < 0.50) shotZone = "center"
else if(Math.random() < 0.80) shotZone = "close"
else shotZone = "long"

}

else{

const r = Math.random()

if(r < 0.35) shotZone = "close"
else if(r < 0.70) shotZone = "center"
else if(r < 0.90) shotZone = "halfspace_left"
else shotZone = "long"

}

const xTBase = applyXTModifier(shotZone)

// xT beeinflusst Qualität der Chance
const xTModifier = 0.6 + xTBase * 3

let zoneMultiplier=1;

if(shotZone === "wing_left" || shotZone === "wing_right"){
zoneMultiplier = 0.9
}

if(shotZone === "halfspace_left" || shotZone === "halfspace_right"){
zoneMultiplier = 1.2
}

if(shotZone==="long") zoneMultiplier=0.4;
if(shotZone==="close") zoneMultiplier=1.6;

/* ENGINES */

const overload =
attackCtx === state.homeCtx
? state.homeOverload
: state.awayOverload
const space = applySpaceCreation(attackCtx,defendCtx);
const shape =
defendCtx === state.homeCtx
? state.homeShape
: state.awayShape

/* CHAOS */

const defenders = defendCtx.defenders

const defender = pickRandom(defenders);

const recovery = applyRecoveryRun(attacker, defender)

const markingModifier = applyMarking(attacker, defendCtx)

const chaos = applyMatchChaos(state, attacker, defender, goalkeeper);

const keeperPosition = applyKeeperPositioning(goalkeeper, shotZone)

/* xG */

const shotQuality = getShotQuality(shotZone)

let xG =
shotQuality * 1.75 *
(attackCtx.coachImpact || 1) *
coverageModifier *
spatialModifier *
rotationModifier *
zoneMultiplier *
xTModifier *
overload.chanceBonus *
space.spaceBonus *
(0.7 + shape.shotSuppression * 0.3) *
markingModifier *
keeperPosition.modifier *
(chaos.xGMultiplier || 1) *
(0.8 + zonePV * 1.4)


if(crossType === "cross"){
xG *= 0.92
}

if(crossType === "cutback"){
xG *= 1.25
}

if(recovery.recovered){

xG *= recovery.modifier

state.events.push({
minute:state.minute,
type:"recovery_run",
player:`${defender.firstName} ${defender.lastName}`
})

}

if(keeperPosition.event){

state.events.push({
minute:state.minute,
type:"keeper_position_error"
})

}

// Fehler erhöhen Torchance
const recentError =
state.events.slice(-3).some(e => e.type === "defensive_error")

if(recentError){
xG *= 1.35
}

// Body Part Impact

if(bodyPart === "header"){
xG *= 0.85
}

if(bodyPart === "volley"){
xG *= 0.80
}

if(bodyPart === "tap_in"){
xG *= 1.45
}

if(bodyPart === "left_foot"){
xG *= 0.95
}

/* BIG CHANCE */

const isBigChance = applyBigChance(state, attacker, goalkeeper);

if(isBigChance){

if(isHomeShot){
state.bigChances.home++
}else{
state.bigChances.away++
}

}

// Momentum durch große Chance
if(isBigChance){

if(isHomeShot){
state.momentum.home += 0.05
}else{
state.momentum.away += 0.05
}

if(isBigChance){
    xG *= 1.45;
}


state.events.push({
minute:state.minute,
type:"big_chance",
player:`${attacker.firstName} ${attacker.lastName}`,
chanceType,
bodyPart
});

}

/* VARIANCE */

xG = applyFinishingVariance(xG, attacker);

const compactness = applyCompactness(defendCtx)
const blockCompact =
defendCtx.blockModifier?.compactness || 1

xG *= 1 / (compactness.shotSuppression * blockCompact)

/* GOALKEEPER IMPACT */

xG = applyGoalkeeperImpact(xG, attacker, goalkeeper);

// KeeperReaction nur leicht
const keeperReaction = applyGoalkeeperReaction(goalkeeper)

xG *= (0.9 + keeperReaction * 0.1)


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

let blockChance = applyBlockingPosition(defender, zone)

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

if(applySecondBallChance(attackCtx, defendCtx) && Math.random() < 0.65){

state.events.push({
minute:state.minute,
type:"second_ball"
})

// zusätzlicher Abschluss statt neuer Angriff
let reboundXG = Math.min(0.18, xG * 0.35)

attacking.shots++
state.debug.shots++
attacking.xG += reboundXG

if(Math.random() < reboundXG * 0.42){

attacking.goals++
state.debug.goals++

state.events.push({
minute:state.minute,
type:"goal",
rebound:true
})

}

return
}

/* GOAL */

const shotData = {
minute: state.minute,
zone: shotZone,
xG: xG,
bodyPart: bodyPart,
chanceType: chanceType,
player: `${attacker.firstName} ${attacker.lastName}`,
x: Math.random(),
y: Math.random()
}

if(isHomeShot){
state.shotMap.home.push(shotData)
}else{
state.shotMap.away.push(shotData)
}

if(process.env.DEBUG_XG){
console.log("SHOT XG", {
zone: shotZone,
xG: xG
})
}


attacking.shots++
state.debug.shots++
attacking.xG += xG

state.zoneStats.shots[shotZone] =
(state.zoneStats.shots[shotZone] || 0) + 1

state.zoneStats.xG[shotZone] =
(state.zoneStats.xG[shotZone] || 0) + xG

// GOAL FUNNEL BALANCER

let goalModifier = 1

const goalRatio =
state.debug.goals / Math.max(1, state.debug.shots)

if(goalRatio > 0.20){
goalModifier = 0.97
}



if(Math.random() < xG * goalModifier * 0.72){




state.zoneStats.goals[shotZone] =
(state.zoneStats.goals[shotZone] || 0) + 1

attacking.goals++;

state.debug.goals++


// Momentum boost nach Tor
if(isHomeShot){
state.momentum.home += 0.15
state.momentum.away -= 0.10
}else{
state.momentum.away += 0.15
state.momentum.home -= 0.10
}

const chain = determineAssistChain(attackCtx.players, creator, attacker)

let assistName = null

if(chain.assist){

assistName = `${chain.assist.firstName} ${chain.assist.lastName}`
addStat(state,chain.assist._id,"assists")

}

if(chain.preAssist){

addStat(state,chain.preAssist._id,"preAssists")

state.events.push({
minute:state.minute,
type:"pre_assist",
player:`${chain.preAssist.firstName} ${chain.preAssist.lastName}`
})

}

const assistType = determineAssistType(
shotZone,
chanceType,
crossType === "cutback",
false
)


state.events.push({
minute:state.minute,
type:"goal",
scorer:`${attacker.firstName} ${attacker.lastName}`,
assist:assistName,
assistType,
chanceType,
bodyPart
});

addStat(state,attacker._id,"goals");

}else{

defending.saves++

// Rebound / Second Ball Chance
if(Math.random() < 0.18){


const rebounder = pickAttacker(attackCtx.players)

let reboundXG = Math.min(0.28, xG * 0.40)

state.events.push({
minute:state.minute,
type:"rebound",
player:`${rebounder.firstName} ${rebounder.lastName}`
})

attacking.shots++
attacking.xG += reboundXG

if(Math.random() < reboundXG){

attacking.goals++
state.debug.goals++

state.events.push({
minute:state.minute,
type:"goal",
scorer:`${rebounder.firstName} ${rebounder.lastName}`,
rebound:true
})

addStat(state,rebounder._id,"goals")

}

}

}

}
// ======================================================
// PLAYER SELECTION
// ======================================================

function pickAttacker(players){

let totalWeight = 0
const weights = []

for(const p of players){

let weight = 1

if(p.positions?.includes("ST")) weight = 6
else if(p.positions?.includes("CAM")) weight = 4
else if(p.positions?.includes("LW") || p.positions?.includes("RW")) weight = 3
else if(p.positions?.includes("CM")) weight = 2
else if(p.positions?.includes("CDM")) weight = 1

weights.push(weight)
totalWeight += weight

}

let r = Math.random() * totalWeight

for(let i=0;i<players.length;i++){

if(r < weights[i]) return players[i]
r -= weights[i]

}

return players[0]

}
 

function pickWeightedCreator(players){

let totalWeight=0;
const weights=[];

for(const p of players){

const role = getRoleWeights(p)

let w = role.pass + role.dribble

// PLAYMAKER BIAS
if(
p.positions?.includes("CAM") ||
p.positions?.includes("CM")
){
w *= 1.25
}

// Elite Playmaker bekommen noch mehr Einfluss
if(p.playstyles?.includes("playmaker")){
w *= 1.35
}

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

return 0.04 + duel*0.35;

}

function applyExpectedThreat(zone){

const xT = {

wing_left: 0.85,
wing_right: 0.85,

halfspace_left: 1.15,
halfspace_right: 1.15,

center: 1.25,

long: 0.55,

close: 1.45

}

return xT[zone] || 1

}

function getPossessionValue(zone){
return PV_GRID[zone] || 0.05
}

function applyXTModifier(zone){

return XT_GRID[zone] || 0.05

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
return Math.max(-0.5,Math.min(0.5,v));
}

function applyMatchFlowProbability(state){

let modifier = 1

const totalGoals = state.home.goals + state.away.goals
const diff = Math.abs(state.home.goals - state.away.goals)

// viele Tore → Spiel beruhigt sich
if(totalGoals >= 4){
modifier *= 0.85
}

if(totalGoals >= 6){
modifier *= 0.70
}

// frühes 0‑0 → vorsichtig
if(totalGoals === 0 && state.minute < 25){
modifier *= 0.85
}

// Unentschieden → Spiel öffnet sich
if(diff === 0){

if(totalGoals === 0){
modifier *= 1.20   // Teams versuchen Tor zu erzwingen
}else{
modifier *= 1.10
}

}


// späte Phase → Risiko
if(state.minute > 75 && totalGoals <= 2){
modifier *= 1.15
}

// letzte Minuten
if(state.minute > 85){
modifier *= 1.25
}

return modifier

}


// ======================================================
// EVENTS
// ======================================================

function maybeYellow(state,team){

let refMod = state.referee?.yellowModifier || 1

let crowdBias = state.crowdPressure ? (1 - state.crowdPressure*0.05) : 1

let chance = 0.0025 * (state.temperature || 1) * refMod * crowdBias

if(Math.random() < chance){
team.yellows++
}

}

function maybeRed(state,team){

let refMod = state.referee?.redModifier || 1

let chance = 0.0008 * (state.temperature || 1) * refMod

if(Math.random() < chance){
team.reds++
}

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

state.injuries.push({
player,
until
})

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
state.playerStats[id]={goals:0,assists:0,preAssists:0};
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

if(total === 0){
return {home:50,away:50}
}

const home = (state.home.control/total)*100;

return{
home:Math.round(home),
away:Math.round(100-home)
};

}

function calculateFieldTilt(state){

const total =
state.territory.home + state.territory.away

if(total === 0){
return {home:50,away:50}
}

const homeTilt =
(state.territory.home / total) * 100

return{
home:Math.round(homeTilt),
away:Math.round(100-homeTilt)
}

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

dangerousAttacks:{
home:state.dangerousPossessions.home,
away:state.dangerousPossessions.away
},

touchesInBox:{
home:state.touchesInBox.home,
away:state.touchesInBox.away
},

bigChances:{
home:state.bigChances.home,
away:state.bigChances.away
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
// PLAYER DECISION ENGINE
// ======================================================

function decideAction(player, attackCtx, defendCtx, state){

const spatial =
applySpatialAwareness(player, attackCtx, defendCtx)    

const pressure = calculatePlayerPressure(player, attackCtx, defendCtx, state)

let shootScore = (player.shooting || 50)
let passScore = (player.passing || 50)
let dribbleScore = (player.dribbling || player.pace || 50)
let crossScore =
(player.crossing || 50)

const personality = applyPlayerPersonality(player)

const coachImpact = attackCtx.coachImpact || 1

const dna = attackCtx.dynamicDNA || attackCtx.coachDNA

shootScore *= dna.risk * coachImpact
passScore *= dna.risk * coachImpact
dribbleScore *= dna.risk * coachImpact
crossScore *= dna.risk * coachImpact


shootScore *= spatial
passScore *= spatial
dribbleScore *= spatial

shootScore *= pressure
passScore *= (2 - pressure)
dribbleScore *= (2 - pressure)
crossScore *= (1 + (pressure - 1) * 0.5)

let total =
shootScore + passScore + dribbleScore + crossScore

let r = Math.random() * total

if(r < shootScore) return "shoot"
r -= shootScore

if(r < passScore) return "pass"
r -= passScore

if(r < dribbleScore) return "dribble"

return "cross"
}

function calculatePlayerPressure(attacker, attackCtx, defendCtx, state){

let pressure = 1

// Pressing Einfluss
const pressing =
defendCtx === state.homeCtx
? state.homePress
: state.awayPress
pressure *= pressing.turnoverModifier || 1

if(applyTransitionMoment(state)){
pressure *= 1.15
}

// Defensive Line
if(defendCtx.defensiveLine === "high"){
pressure *= 1.15
}

if(defendCtx.defensiveLine === "low"){
pressure *= 0.90
}

// Match Temperatur (hitzige Spiele = mehr Fehler)
pressure *= state.temperature || 1

// Müdigkeit erhöht Fehler
if(attacker?.fitness){
pressure *= (1 + (100 - attacker.fitness) * 0.003)
}

return pressure

}

function applyTacticalStyle(ctx){

let modifiers = {
attack:1,
defense:1,
tempo:1
}

switch(ctx.style){

case "gegenpress":
modifiers.attack = 1.15
modifiers.defense = 0.95
modifiers.tempo = 1.25
break

case "possession":
modifiers.attack = 1.05
modifiers.defense = 1.05
modifiers.tempo = 0.85
break

case "counter":
modifiers.attack = 1.20
modifiers.defense = 0.95
modifiers.tempo = 1.10
break

case "parkbus":
modifiers.attack = 0.80
modifiers.defense = 1.25
modifiers.tempo = 0.70
break

case "longball":
modifiers.attack = 1.10
modifiers.defense = 0.95
modifiers.tempo = 1.10
break

}

return modifiers

}

function applyDefensiveLine(ctx, state){

let line = "mid"

switch(ctx.style){

case "gegenpress":
line = "high"
break

case "possession":
line = "high"
break

case "counter":
line = "mid"
break

case "longball":
line = "mid"
break

case "parkbus":
line = "low"
break

}

// Game State Anpassung

const isHome = ctx === state.homeCtx

const goalsFor = isHome ? state.home.goals : state.away.goals
const goalsAgainst = isHome ? state.away.goals : state.home.goals

// Führung → tiefer verteidigen
if(goalsFor > goalsAgainst){
line = "low"
}

// Rückstand → höher pressen
if(goalsFor < goalsAgainst){
line = "high"
}

return line

}

function getTempoModifier(ctx){

switch(ctx.style){

case "gegenpress": return 1.3
case "counter": return 1.2
case "longball": return 1.1
case "possession": return 0.85
case "parkbus": return 0.75

default: return 1

}

}

function getAttackVolumeModifier(ctx){

switch(ctx.style){

case "gegenpress":
return 1.25

case "possession":
return 1.10

case "balanced":
return 1

case "counter":
return 0.92

case "longball":
return 0.88

case "parkbus":
return 0.75

default:
return 1

}

}

function getDefensiveLineModifiers(line){

switch(line){

case "high":
return {
progressModifier: 0.9,
throughBallBonus: 1.25,
longShotSuppression: 0.9
}

case "mid":
return {
progressModifier: 1,
throughBallBonus: 1,
longShotSuppression: 1
}

case "low":
return {
progressModifier: 1.15,
throughBallBonus: 0.75,
longShotSuppression: 1.2
}

default:
return {
progressModifier: 1,
throughBallBonus: 1,
longShotSuppression: 1
}

}

}

// ======================================================
// UTILS
// ======================================================

function round(n){
return Number(n.toFixed(3));
}
