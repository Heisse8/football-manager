function getTrainerDevelopmentModifier(coach){

if(!coach) return 1

const stars = coach.stars || 2

switch(stars){

case 5: return 1.35
case 4.5: return 1.30
case 4: return 1.25
case 3.5: return 1.20
case 3: return 1.15
case 2.5: return 1.10
case 2: return 1.05

default:
return 1

}

}

function applyPlayerDevelopment(player, coach){

if(!player) return player

const modifier = getTrainerDevelopmentModifier(coach)

/* Beispiel Entwicklung */

player.potentialProgress =
(player.potentialProgress || 0) + (1 * modifier)

/* Optional Rating Wachstum */

if(player.potentialProgress >= 100){

player.rating += 1
player.potentialProgress = 0

}

return player

}

module.exports = {
applyPlayerDevelopment,
getTrainerDevelopmentModifier
}
