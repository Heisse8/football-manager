const philosophyFormations = {

ballbesitz:["433","4231","3241"],
gegenpressing:["41212","433","4231"],
konter:["442","4231","532","541"],
mauern:["442","541","532"]

};

function chooseFormation(team, opponent){

const coach = team.coach || {}
const pref = coach.preferredFormation || "4-4-2"

let formation = pref

const oppAttack = opponent?.attackStrength || 50
const myAttack = team?.attackStrength || 50

/* =====================================================
GEGNER STÄRKER → defensiver
===================================================== */

if(oppAttack > myAttack + 10){

if(pref === "4-3-3") formation = "4-2-3-1"
if(pref === "4-4-2") formation = "5-3-2"

}

/* =====================================================
GEGNER SCHWÄCHER → offensiver
===================================================== */

if(myAttack > oppAttack + 10){

if(pref === "4-4-2") formation = "4-3-3"
if(pref === "5-3-2") formation = "3-5-2"

}

/* =====================================================
GEGENPRESS TRAINER → öfter 4‑3‑3
===================================================== */

if(coach.philosophy === "gegenpressing" && Math.random() < 0.35){
formation = "4-3-3"
}

/* =====================================================
DEFENSIVE TRAINER → öfter 5ER KETTE
===================================================== */

if(coach.philosophy === "defensiv" && Math.random() < 0.40){
formation = "5-3-2"
}

/* =====================================================
HEIMVORTEIL → etwas offensiver
===================================================== */

if(team.homeBonus && team.homeBonus > 1.1){

if(pref === "4-4-2") formation = "4-3-3"
if(pref === "5-3-2") formation = "3-5-2"

}

/* =====================================================
SCHWÄCHERES TEAM → defensiver reagieren
===================================================== */

if(opponent && myAttack < oppAttack){

if(pref === "4-3-3") formation = "4-2-3-1"
if(pref === "4-2-3-1") formation = "5-3-2"

}

return formation

}

module.exports = { chooseFormation }
