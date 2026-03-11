const SystemLock = require("../models/SystemLock");

async function acquireLock(key){

const lock = await SystemLock.findOneAndUpdate(
{
key,
locked:false
},
{
locked:true,
lockedAt:new Date()
},
{
upsert:true,
new:true
}
);

return lock;

}

async function releaseLock(key){

await SystemLock.updateOne(
{ key },
{ locked:false }
);

}

module.exports = { acquireLock, releaseLock };