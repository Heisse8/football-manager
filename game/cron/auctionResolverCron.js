const cron = require("node-cron");

const { resolveAuctions } = require("../services/auctionResolver");

function startAuctionResolverCron(){

cron.schedule("* * * * *", async ()=>{

try{

await resolveAuctions();

}catch(err){

console.error("Auction Resolver Fehler:",err);

}

});

console.log("Auction Resolver gestartet");

}

module.exports = { startAuctionResolverCron };