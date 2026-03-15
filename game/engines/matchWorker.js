const { parentPort } = require("worker_threads")

const { simulateRealisticMatch } = require("./matchEngine")

parentPort.on("message", async (matchData) => {

const result = await simulateRealisticMatch(matchData)

parentPort.postMessage(result)

})