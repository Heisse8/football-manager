function calculatePlayerRating(player){

let rating = 0

if(player.positions.includes("ST")){
rating =
player.shooting * 0.4 +
player.pace * 0.2 +
player.dribbling * 0.2 +
player.mentality * 0.2
}

else if(player.positions.includes("CB")){
rating =
player.defending * 0.45 +
player.physical * 0.25 +
player.mentality * 0.2 +
player.pace * 0.1
}

else{
rating =
player.passing * 0.35 +
player.dribbling * 0.25 +
player.mentality * 0.2 +
player.physical * 0.2
}

return rating
}

function calculateStars(player){

const rating = calculatePlayerRating(player)

const stars = rating / 20

return Math.max(1, Math.min(5, stars))

}

module.exports = {
calculatePlayerRating,
calculateStars
}
