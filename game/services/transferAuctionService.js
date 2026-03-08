const Player = require("../models/Player");
const Team = require("../models/Team");

async function resolveAuctions(){

const now = new Date();

const players = await Player.find({

transferType:"auction",
auctionEnd:{ $lte: now },
isListed:true

});

for(const player of players){

if(player.highestBidder){

const buyer = await Team.findById(player.highestBidder);
const seller = await Team.findById(player.team);

if(buyer.balance >= player.currentBid){

buyer.balance -= player.currentBid;
seller.balance += player.currentBid;

player.team = buyer._id;

await buyer.save();
await seller.save();

}

}

player.isListed = false;
player.transferType = null;
player.auctionEnd = null;

await player.save();

}

}

module.exports = { resolveAuctions };