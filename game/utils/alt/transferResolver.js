const Transfer = require("../models/Transfer");
const Player = require("../models/Player");
const Manager = require("../models/Manager");
const Scout = require("../models/Scout");
const Team = require("../models/Team");

async function resolveExpiredTransfers() {

const now = new Date();

const transfers = await Transfer.find({
status: "active",
expiresAt: { $lt: now }
});

for (const transfer of transfers) {

transfer.status = "finished";

/* =====================================================
 KEIN BIETER
===================================================== */

if (!transfer.highestBidder) {

await transfer.save();
continue;

}

/* =====================================================
 TEAMS LADEN
===================================================== */

const buyer = await Team.findById(transfer.highestBidder);

const seller = transfer.seller
? await Team.findById(transfer.seller)
: null;

if (!buyer) {
await transfer.save();
continue;
}

/* =====================================================
 GELD PRÜFEN
===================================================== */

if (buyer.balance < transfer.currentBid) {
await transfer.save();
continue;
}

/* =====================================================
 GELD TRANSFER
===================================================== */

buyer.balance -= transfer.currentBid;

if (seller) {
seller.balance += transfer.currentBid;
await seller.save();
}

/* =====================================================
 ITEM ÜBERTRAGEN
===================================================== */

if (transfer.type === "player") {

const player = await Player.findById(transfer.item);

if (player) {

player.team = buyer._id;
await player.save();

}

}

if (transfer.type === "manager") {

const manager = await Manager.findById(transfer.item);

if (manager) {

manager.team = buyer._id;
await manager.save();

}

}

if (transfer.type === "scout") {

const scout = await Scout.findById(transfer.item);

if (scout) {

scout.team = buyer._id;
await scout.save();

}

}

/* =====================================================
 TEAM SPEICHERN
===================================================== */

await buyer.save();
await transfer.save();

}

}

module.exports = { resolveExpiredTransfers };