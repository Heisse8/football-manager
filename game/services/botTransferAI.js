const Team = require("../models/Team");
const Player = require("../models/Player");

/* =====================================================
 BOT TRANSFER AI
===================================================== */

async function runBotTransfers(){

const bots = await Team.find({ isBot:true });

for(const bot of bots){

const squad = await Player.find({ team:bot._id });

if(squad.length === 0) continue;

/* =====================================================
 TEAM STÄRKE
===================================================== */

const avgStars =
squad.reduce((sum,p)=>sum + (p.stars || 0),0) / squad.length;

/* =====================================================
 POSITION CHECK
===================================================== */

const positionsNeeded = [];

if(!squad.some(p => p.positions && p.positions.includes("GK")))
positionsNeeded.push("GK");

if(!squad.some(p => p.positions && p.positions.includes("ST")))
positionsNeeded.push("ST");

if(!squad.some(p => p.positions && p.positions.includes("CB")))
positionsNeeded.push("CB");

/* =====================================================
 MARKT SPIELER SUCHEN
===================================================== */

const marketPlayers = await Player.find({
isListed:true,
transferType:"auction"
}).limit(30);

for(const player of marketPlayers){

/* nicht selbst überbieten */

if(player.highestBidder &&
player.highestBidder.toString() === bot._id.toString())
continue;

/* Budget */

const currentBid =
player.highestBid || player.transferPrice || 0;

if(bot.balance < currentBid) continue;

/* Marktwert Limit */

if(player.highestBid > player.marketValue * 1.2) continue;

/* Bot kauft nur bessere Spieler */

if((player.stars || 0) < avgStars) continue;

/* Position bevorzugen */

if(
positionsNeeded.length > 0 &&
!(player.positions || []).some(pos =>
positionsNeeded.includes(pos)
)
){
continue;
}

/* Wahrscheinlichkeit */

if(Math.random() > 0.35) continue;

/* Gebot */

const newBid = Math.floor(player.highestBid * 1.1);

player.highestBid = newBid;
player.highestBidder = bot._id;

await player.save();

console.log("🤖 Bot bietet auf:", player.lastName);

break;

}

/* =====================================================
 SCHWACHE SPIELER VERKAUFEN
===================================================== */

const weakPlayers =
squad.filter(p => (p.stars || 0) < avgStars - 0.5);

if(weakPlayers.length > 0 && Math.random() < 0.3){

const player =
weakPlayers[Math.floor(Math.random()*weakPlayers.length)];

player.isListed = true;
player.transferType = "auction";

player.highestBid = Math.floor(player.marketValue * 0.8);

const end = new Date();
end.setHours(end.getHours() + 48);

player.auctionEnd = end;
player.sellerTeam = bot._id;

await player.save();

console.log("💰 Bot verkauft:", player.lastName);

}

}

}

module.exports = { runBotTransfers };