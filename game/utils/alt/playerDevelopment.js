const Player = require("../../models/Player");
const { calculateMarketValue } = require("./marketValueCalculator");

function random(min,max){
return Math.random()*(max-min)+min;
}

async function runPlayerDevelopment(){

const players = await Player.find();

for(const player of players){

let change = 0;

/* ================= ALTER ================= */

if(player.age <= 21){

change = random(0.1,0.4);

}

else if(player.age <= 24){

change = random(0.05,0.25);

}

else if(player.age <= 28){

change = random(-0.05,0.1);

}

else if(player.age <= 31){

change = random(-0.15,0);

}

else{

change = random(-0.3,-0.1);

}

/* ================= PERFORMANCE ================= */

const goals = player.seasonStats?.goals || 0;
const assists = player.seasonStats?.assists || 0;

if(goals > 10) change += 0.1;
if(assists > 8) change += 0.05;

/* ================= POTENTIAL LIMIT ================= */

let newStars = player.stars + change;

if(newStars > player.potential){

newStars = player.potential;

}

/* Minimum */

if(newStars < 0.5){

newStars = 0.5;

}

/* Rundung */

player.stars = Number(newStars.toFixed(1));

/* Marktwert neu berechnen */

player.marketValue = calculateMarketValue(player);

await player.save();

}

}

module.exports = {
runPlayerDevelopment
};