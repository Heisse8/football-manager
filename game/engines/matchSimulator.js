const { Worker } = require("worker_threads")
const path = require("path")

function runMatch(matchData){

return new Promise((resolve,reject)=>{

const worker = new Worker(
path.join(__dirname,"matchWorker.js")
)

worker.postMessage(matchData)

worker.on("message", resolve)
worker.on("error", reject)

})

}

async function simulateMatchday(matches){

const BATCH_SIZE = 50
let results = []

for(let i=0;i<matches.length;i+=BATCH_SIZE){

const batch = matches.slice(i,i+BATCH_SIZE)

const batchResults =
await Promise.all(batch.map(match => runMatch(match)))

results.push(...batchResults)

}

return results

}

module.exports = { simulateMatchday }