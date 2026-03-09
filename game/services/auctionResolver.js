const Player = require("../models/Player");
const Team = require("../models/Team");

async function resolveAuctions(){

const now = new Date();

const auctions = await Player.find({
isListed:true,
transferType:"auction",
auctionEnd:{ $lte:now }
});

for(const player of auctions){

await resolvePlayerAuction(player);

}

}

module.exports = { resolveAuctions };



async function resolvePlayerAuction(player){

/* Verkäufer */

const seller = await Team.findById(player.sellerTeam);

if(!seller){

await cancelAuction(player);
return;

}

/* Kein Gebot */

if(!player.highestBidder){

player.isListed = false;
player.transferType = "instant";
player.transferPrice = 0;
player.auctionEnd = null;

await player.save();

return;

}

/* Käufer */

const buyer = await Team.findById(player.highestBidder);

if(!buyer){

await cancelAuction(player);
return;

}

/* Geld prüfen */

if(buyer.balance < player.highestBid){

await cancelAuction(player);
return;

}

/* Geld transfer */

buyer.balance -= player.highestBid;
seller.balance += player.highestBid;

buyer.transferSpending += player.highestBid;
seller.transferIncome += player.highestBid;

/* Spieler wechseln */

player.team = buyer._id;

/* Auktion reset */

player.isListed = false;
player.transferType = "instant";
player.transferPrice = 0;
player.auctionEnd = null;
player.highestBid = 0;
player.highestBidder = null;
player.sellerTeam = null;

await buyer.save();
await seller.save();
await player.save();

}



/* Auktion abbrechen */

async function cancelAuction(player){

player.isListed = false;
player.transferType = "instant";
player.transferPrice = 0;
player.auctionEnd = null;
player.highestBid = 0;
player.highestBidder = null;

await player.save();

}