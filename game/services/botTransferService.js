const Team = require("../models/Team");
const Player = require("../models/Player");

/* =====================================================
 BOT TRANSFER SYSTEM
===================================================== */

async function runBotTransfers(){

const botTeams = await Team.find({ isBot:true });

for(const team of botTeams){

await botSellPlayers(team);
await botBuyPlayers(team);

}

}

/* =====================================================
 BOT VERKAUFT SCHWACHE SPIELER
===================================================== */

async function botSellPlayers(team){

const players = await Player.find({ team:team._id });

if(players.length <= 20) return;

/* nach Stärke sortieren */

players.sort((a,b)=>a.stars - b.stars);

/* schwächster Spieler */

const player = players[0];

if(Math.random() > 0.4) return;

player.isListed = true;
player.transferType = "auction";

player.highestBid = Math.floor(player.marketValue * 0.8);
player.highestBidder = null;

const end = new Date();
end.setHours(end.getHours()+48);

player.auctionEnd = end;
player.sellerTeam = team._id;

await player.save();

console.log("🤖 Bot verkauft:", player.lastName);

}

/* =====================================================
 BOT KAUFT SPIELER
===================================================== */

async function botBuyPlayers(team){

const squadSize = await Player.countDocuments({
team:team._id
});

if(squadSize >= 22) return;

/* Marktspieler */

const marketPlayers = await Player.find({
isListed:true,
team:{ $ne: team._id }
}).limit(20);

if(marketPlayers.length === 0) return;

/* zufälliger Spieler */

const player =
marketPlayers[Math.floor(Math.random()*marketPlayers.length)];

/* Buy Now Transfer */

if(player.transferType === "buy_now"){

if(team.balance >= player.transferPrice){

const seller = await Team.findById(player.team);

team.balance -= player.transferPrice;

if(seller){
seller.balance += player.transferPrice;
await seller.save();
}

player.team = team._id;
player.isListed = false;
player.transferType = "instant";

await team.save();
await player.save();

console.log("🤖 Bot kauft:", player.lastName);

}

}

}

module.exports = { runBotTransfers };