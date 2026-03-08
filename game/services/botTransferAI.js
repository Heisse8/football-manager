const Team = require("../models/Team");
const Player = require("../models/Player");

/* =====================================================
BOT TRANSFER AI
===================================================== */

async function runBotTransfers(){

const bots = await Team.find({ isBot:true });

for(const bot of bots){

/* Kader laden */

const squad = await Player.find({ team:bot._id });

/* =====================================================
SPIELER KAUFEN
===================================================== */

if(squad.length < 22){

const budget = bot.balance;

/* Marktspieler suchen */

const marketPlayers = await Player.find({
isListed:true,
transferType:"auction"
}).limit(20);

for(const player of marketPlayers){

if(player.highestBid > budget) continue;

/* Bot Wahrscheinlichkeit */

if(Math.random() > 0.25) continue;

/* Gebot */

const newBid = Math.floor(player.highestBid * 1.1);

player.highestBid = newBid;
player.highestBidder = bot._id;

await player.save();

console.log("Bot bietet auf", player.lastName);

break;

}

}

/* =====================================================
FREE AGENTS KAUFEN
===================================================== */

if(Math.random() < 0.3){

const freeAgents = await Player.find({
team:null
}).limit(10);

if(freeAgents.length > 0){

const target =
freeAgents[Math.floor(Math.random()*freeAgents.length)];

const price = target.marketValue;

if(bot.balance >= price){

bot.balance -= price;

target.team = bot._id;

await target.save();
await bot.save();

console.log("Bot kaufte Free Agent:", target.lastName);

}

}

}

/* =====================================================
SCHWACHE SPIELER VERKAUFEN
===================================================== */

const weakPlayers = squad.filter(p => p.stars <= 1.5);

if(weakPlayers.length > 0 && Math.random() < 0.25){

const player =
weakPlayers[Math.floor(Math.random()*weakPlayers.length)];

player.isListed = true;
player.transferType = "auction";
player.highestBid = Math.floor(player.marketValue * 0.8);

const end = new Date();
end.setHours(end.getHours()+48);

player.auctionEnd = end;
player.sellerTeam = bot._id;

await player.save();

console.log("Bot verkauft Spieler:", player.lastName);

}

}

}

module.exports = { runBotTransfers };