const Player = require("../models/Player");

/* =====================================================
 FREE AGENTS AUF MARKT SETZEN
===================================================== */

async function listFreeAgentsOnMarket(){

const freeAgents = await Player.find({

team: null,
isListed: false,
auctionEnd: null

}).limit(20);

for(const player of freeAgents){

/* =====================================================
 STARTPREIS
===================================================== */

const startPrice = Math.round(
player.marketValue * (0.6 + Math.random() * 0.2)
);

/* =====================================================
 AUKTION ENDE
===================================================== */

const end = new Date();
end.setHours(end.getHours() + 24);

/* =====================================================
 LISTEN
===================================================== */

player.isListed = true;

player.transferType = "auction";

player.highestBid = startPrice;
player.highestBidder = null;

player.auctionEnd = end;

/* Free Agents haben keinen Seller */

player.sellerTeam = null;

await player.save();

}

console.log("💸 Free Agents auf Markt gesetzt:", freeAgents.length);

}

module.exports = { listFreeAgentsOnMarket };