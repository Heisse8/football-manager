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
BOT VERKAUFT SPIELER
===================================================== */

async function botSellPlayers(team){

const players = await Player.find({ team:team._id });

if(players.length <= 20) return;

const randomPlayer =
players[Math.floor(Math.random()*players.length)];

randomPlayer.isListed = true;
randomPlayer.transferType = "auction";

randomPlayer.currentBid = 0;
randomPlayer.highestBidder = null;

const end = new Date();
end.setHours(end.getHours()+48);

randomPlayer.auctionEnd = end;

randomPlayer.sellerTeam = team._id;

await randomPlayer.save();

}

/* =====================================================
BOT KAUFT SPIELER
===================================================== */

async function botBuyPlayers(team){

const squadSize = await Player.countDocuments({
team:team._id
});

if(squadSize >= 22) return;

const marketPlayers = await Player.find({
isListed:true,
team:{ $ne: team._id }
})
.limit(20);

if(marketPlayers.length === 0) return;

const player =
marketPlayers[Math.floor(Math.random()*marketPlayers.length)];

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

await team.save();
await player.save();

}

}

}

module.exports = { runBotTransfers };