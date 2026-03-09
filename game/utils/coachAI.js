const philosophyFormations = {

ballbesitz:["433","4231","3241"],
gegenpressing:["41212","433","4231"],
konter:["442","4231","532","541"],
mauern:["442","541","532"]

};

function chooseFormation(team, opponent){

const style = team.tactics?.playStyle || "ballbesitz";

const possible = philosophyFormations[style] || ["442"];

/* =====================================================
HEIMVORTEIL → offensiver
===================================================== */

if(team.homeBonus && team.homeBonus > 1.1){

if(possible.includes("433")) return "433";
if(possible.includes("4231")) return "4231";

}

/* =====================================================
SCHWÄCHERES TEAM → defensiver
===================================================== */

if(opponent && team.attackStrength < opponent.attackStrength){

if(possible.includes("541")) return "541";
if(possible.includes("532")) return "532";

}

/* =====================================================
ZUFÄLLIGE FORMATION
===================================================== */

return random(possible);

}

/* =====================================================
UTIL RANDOM
===================================================== */

function random(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

module.exports = { chooseFormation };