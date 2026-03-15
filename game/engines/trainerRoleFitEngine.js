function calculateRoleFit(player, coach){

if(!player) return 1
if(!coach) return 1

let score = 1

const style = coach.philosophy

/* =========================
BALLBESITZ
========================= */

if(style === "ballbesitz"){

score += (player.passing || 50) / 200
score += (player.technique || 50) / 200
score += (player.vision || 50) / 200

}

/* =========================
GEGENPRESS
========================= */

if(style === "gegenpressing"){

score += (player.stamina || 50) / 200
score += (player.workrate || 50) / 200
score += (player.pace || 50) / 200

}

/* =========================
KONTER
========================= */

if(style === "konter"){

score += (player.pace || 50) / 180
score += (player.dribbling || 50) / 200

}

/* =========================
DEFENSIV
========================= */

if(style === "defensiv"){

score += (player.defending || 50) / 180
score += (player.positioning || 50) / 200
score += (player.mentality || 50) / 200

}

return score

}

module.exports = { calculateRoleFit }
