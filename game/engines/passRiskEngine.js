// ======================================================
// PASS RISK ENGINE
// ======================================================

function applyPassRisk(player, zone){

let turnover = 0.08

// zentrale Zonen riskanter
if(zone === "center") turnover += 0.05

if(zone === "halfspace_left" || zone === "halfspace_right"){
turnover += 0.03
}

// Flügel etwas sicherer
if(zone === "wing_left" || zone === "wing_right"){
turnover -= 0.02
}

// Spielerqualität
const passing = player?.passing || 50

turnover *= (1.2 - passing / 120)

// Clamp
turnover = Math.max(0.02, Math.min(0.35, turnover))

return {
turnover
}

}

module.exports = {
applyPassRisk
}