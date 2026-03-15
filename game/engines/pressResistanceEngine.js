function applyPressResistance(player, pressModifier){

if(!player){
return 1
}

let resistance =
(player.dribbling || 50) * 0.4 +
(player.passing || 50) * 0.3 +
(player.mentality || 50) * 0.3

resistance = resistance / 100

// gutes Pressing reduziert Resistenz
resistance *= 1 / (pressModifier || 1)

return Math.max(0.6, Math.min(1.4, resistance))

}

module.exports = { applyPressResistance }