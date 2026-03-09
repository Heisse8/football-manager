const Team = require("../models/Team");

/* =====================================================
 BOT TACTIC AI
===================================================== */

async function updateBotTactics(){

const bots = await Team.find({ isBot:true });

for(const bot of bots){

/* Tabellenposition */

const position = bot.tablePosition || 10;

/* =====================================================
 FORMATION
===================================================== */

let formation = "4-4-2";

if(position <= 4){

formation = random([
"4-3-3",
"4-2-3-1"
]);

}else if(position <= 10){

formation = random([
"4-4-2",
"4-2-3-1"
]);

}else{

formation = random([
"4-4-2",
"3-5-2"
]);

}

/* =====================================================
 MENTALITÄT
===================================================== */

let mentality = "ausgewogen";

if(position <= 4){

mentality = random([
"offensiv",
"sehr_offensiv"
]);

}else if(position >= 14){

mentality = random([
"defensiv",
"ausgewogen"
]);

}

/* =====================================================
 PRESSING
===================================================== */

let pressing = "mittel";

if(position <= 6){

pressing = random([
"hoch",
"sehr_hoch"
]);

}else if(position >= 14){

pressing = "low_block";

}

/* =====================================================
 DEFENSIVE LINE
===================================================== */

let defensiveLine = "mittel";

if(mentality === "sehr_offensiv"){
defensiveLine = "hoch";
}

if(mentality === "defensiv"){
defensiveLine = "tief";
}

/* =====================================================
 TACTIC OBJECT SICHERSTELLEN
===================================================== */

if(!bot.tactics){
bot.tactics = {};
}

/* =====================================================
 SPEICHERN
===================================================== */

bot.formation = formation;

bot.tactics.mentality = mentality;
bot.tactics.pressing = pressing;
bot.tactics.defensiveLine = defensiveLine;

await bot.save();

}

console.log("🤖 Bot Taktiken aktualisiert");

}

/* =====================================================
 UTIL
===================================================== */

function random(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

module.exports = { updateBotTactics };