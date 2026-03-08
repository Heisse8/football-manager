const cron = require("node-cron");

const Player = require("../models/Player");
const Team = require("../models/Team");

function startAuctionCron(){

cron.schedule("*/30 * * * * *", async ()=>{

try{

const players = await Player.find({
transferType:"auction",
isListed:true,
auctionEnd:{ $lte:new Date() }
});

for(const player of players){

if(!player.highestBidder) continue;

const buyer = await Team.findById(player.highestBidder);
const seller = await Team.findById(player.sellerTeam);

if(!buyer) continue;

/* Geld */

buyer.balance -= player.highestBid;

if(seller){
seller.balance += player.highestBid;
await seller.save();
}

/* Spieler wechseln */

player.team = buyer._id;
player.isListed = false;
player.transferType = "instant";
player.highestBid = 0;
player.highestBidder = null;
player.auctionEnd = null;
player.sellerTeam = null;

await buyer.save();
await player.save();

console.log("Auktion beendet:", player.firstName, player.lastName);

}

}catch(err){

console.error("AuctionCron Fehler:",err);

}

});

}

module.exports = { startAuctionCron };