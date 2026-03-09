const mongoose = require("mongoose");

const Player = require("../models/Player");
const Team = require("../models/Team");

async function executeTransfer(playerId, buyerTeamId, price){

const session = await mongoose.startSession();

try{

session.startTransaction();

/* Spieler laden */

const player = await Player.findById(playerId).session(session);

if(!player) throw new Error("Spieler nicht gefunden");

/* Verkäufer */

const seller = await Team.findById(player.team).session(session);

/* Käufer */

const buyer = await Team.findById(buyerTeamId).session(session);

if(!buyer) throw new Error("Käufer nicht gefunden");

/* Geld prüfen */

if(buyer.balance < price){

throw new Error("Nicht genug Geld");

}

/* Geld bewegen */

buyer.balance -= price;
seller.balance += price;

buyer.transferSpending += price;
seller.transferIncome += price;

/* Spieler übertragen */

player.team = buyer._id;

/* Transfermarkt reset */

player.isListed = false;
player.transferPrice = 0;
player.transferType = "instant";
player.auctionEnd = null;
player.highestBid = 0;
player.highestBidder = null;
player.sellerTeam = null;

/* speichern */

await player.save({ session });
await buyer.save({ session });
await seller.save({ session });

await session.commitTransaction();

session.endSession();

return { success:true };

}catch(err){

await session.abortTransaction();
session.endSession();

throw err;

}

}

module.exports = { executeTransfer };