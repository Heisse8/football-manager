const Transfer = require("../../models/Transfer");
const Team = require("../../models/Team");

async function runAITransferBidding() {

const transfers = await Transfer.find({
status: "active"
});

if(transfers.length === 0) return;

const botTeams = await Team.find({ isBot:true });

if(botTeams.length === 0) return;

for(const transfer of transfers){

/* 30% Chance dass Bots reagieren */

if(Math.random() > 0.3) continue;

const bot = botTeams[Math.floor(Math.random()*botTeams.length)];

if(!bot) continue;

/* neues Gebot */

let newBid = transfer.currentBid * (1.05 + Math.random()*0.10);
newBid = Math.round(newBid);

/* Bot muss Geld haben */

if(bot.balance < newBid) continue;

/* Gebot setzen */

transfer.currentBid = newBid;
transfer.highestBidder = bot._id;

await transfer.save();

console.log("🤖 Bot bietet", newBid);

}

}

module.exports = { runAITransferBidding };