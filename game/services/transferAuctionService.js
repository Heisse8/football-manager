const Player = require("../models/Player");
const Team = require("../models/Team");

/* =====================================================
AUKTIONEN AUFLÖSEN
===================================================== */

async function resolveAuctions(){

const now = new Date();

const players = await Player.find({

transferType:"auction",
auctionEnd:{ $lte: now },
isListed:true

});

console.log("Auktionen beendet:", players.length);

for(const player of players){

/* =====================================================
HAT EIN BIETER GEWONNEN
===================================================== */

if(player.highestBidder){

const buyer = await Team.findById(player.highestBidder);
const seller = await Team.findById(player.sellerTeam);

const bid = player.highestBid || 0;

if(buyer && buyer.balance >= bid){

/* Geld transferieren */

buyer.balance -= bid;

if(seller){
seller.balance += bid;
await seller.save();
}

/* Spieler wechseln */

player.team = buyer._id;

await buyer.save();

console.log(
`Transfer: ${player.lastName} → ${buyer.name} (${bid})`
);

}

}

/* =====================================================
AUKTION RESET
===================================================== */

player.isListed = false;
player.transferType = null;

player.highestBid = 0;
player.highestBidder = null;

player.auctionEnd = null;
player.sellerTeam = null;

await player.save();

}

}

module.exports = { resolveAuctions };