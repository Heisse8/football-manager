const cron = require("node-cron");

const Player = require("../models/Player");
const Team = require("../models/Team");

function startAuctionCron(){

cron.schedule("*/10 * * * * *", async ()=>{

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

/* Prüfen ob Käufer genug Geld hat */

if(buyer.balance < player.highestBid){

console.log("Auktion abgebrochen (zu wenig Geld)");

player.isListed = false;
player.transferType = null;
player.highestBid = 0;
player.highestBidder = null;
player.auctionEnd = null;

await player.save();

continue;

}

/* Geld transfer */

buyer.balance -= player.highestBid;

if(seller){
seller.balance += player.highestBid;
await seller.save();
}

/* Spieler wechselt Team */

player.team = buyer._id;
player.isListed = false;
player.transferType = null;
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