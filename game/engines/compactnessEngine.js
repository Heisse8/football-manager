function applyCompactness(defendCtx){

let compactness = 1

if(defendCtx.style === "parkbus") compactness = 1.35
if(defendCtx.style === "counter") compactness = 1.15
if(defendCtx.style === "possession") compactness = 0.95
if(defendCtx.style === "gegenpress") compactness = 0.90

return {
shotSuppression:compactness,
passBlocking:compactness
}

}

module.exports = { applyCompactness }