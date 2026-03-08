const Player = require("../models/Player");

/* =====================================================
FREE AGENTS AUF MARKT SETZEN
===================================================== */

async function listFreeAgentsOnMarket(){

const freeAgents = await Player.find({
team: null,
isListed: false
}).limit(20);

for(const player of freeAgents){

/* Startpreis */

const startPrice = Math.round(player.marketValue * 0.7);

/* Auktion Ende */

const end = new Date();
end.setHours(end.getHours() + 24);

player.isListed = true;
player.transferType = "auction";
player.highestBid = startPrice;
player.auctionEnd = end;

await player.save();

}

console.log("Free Agents auf Markt gesetzt:", freeAgents.length);

}

module.exports = { listFreeAgentsOnMarket };