/* =====================================================
SCOUT PLAYER GENERATOR
===================================================== */

function generateScoutPlayers(stars){

const players=[];

/* =====================================================
ANZAHL TALENTE
bessere Scouts finden mehr Spieler
===================================================== */

let count = 1;

const roll = Math.random();

if(stars >= 4){
if(roll > 0.3) count = 2;
if(roll > 0.7) count = 3;
}
else if(stars >= 3){
if(roll > 0.5) count = 2;
}
else{
if(roll > 0.8) count = 2;
}

/* =====================================================
SPIELER ERZEUGEN
===================================================== */

for(let i=0;i<count;i++){

const rating = generateStarRating(stars);

/* Potential */

let potential = rating + Math.random()*1.5;

if(potential > 5) potential = 5;

/* Alter */

const age = randomAge();

/* Spieler */

players.push({

stars: Number(rating.toFixed(1)),
potential: Number(potential.toFixed(1)),

age,

position: randomPosition()

});

}

return players;

}

/* =====================================================
SCOUT QUALITÄT → SPIELER QUALITÄT
===================================================== */

function generateStarRating(scoutStars){

const r = Math.random();

/* =====================================================
1 STAR SCOUT
===================================================== */

if(scoutStars === 1){

if(r < 0.6) return 1 + Math.random()*0.5;
if(r < 0.9) return 2 + Math.random()*0.3;

return 3;

}

/* =====================================================
2 STAR SCOUT
===================================================== */

if(scoutStars === 2){

if(r < 0.4) return 2 + Math.random()*0.5;
if(r < 0.8) return 3 + Math.random()*0.3;

return 3.5;

}

/* =====================================================
3 STAR SCOUT
===================================================== */

if(scoutStars === 3){

if(r < 0.4) return 3 + Math.random()*0.4;
if(r < 0.75) return 3.5 + Math.random()*0.3;

return 4;

}

/* =====================================================
4 STAR SCOUT
===================================================== */

if(scoutStars === 4){

if(r < 0.4) return 3.5 + Math.random()*0.4;
if(r < 0.8) return 4 + Math.random()*0.3;

return 4.5;

}

/* =====================================================
5 STAR SCOUT
===================================================== */

if(scoutStars === 5){

if(r < 0.3) return 4 + Math.random()*0.3;
if(r < 0.7) return 4.5 + Math.random()*0.3;

if(r < 0.95) return 4.8;

/* seltenes Wunderkind */

return 5;

}

return 2;

}

/* =====================================================
ALTER (Jugendspieler)
===================================================== */

function randomAge(){

const roll = Math.random();

/* sehr jung */

if(roll < 0.35){
return random(15,17);
}

/* normal */

if(roll < 0.75){
return random(18,20);
}

/* ältere Talente */

return random(21,23);

}

/* =====================================================
REALISTISCHE POSITIONSVERTEILUNG
===================================================== */

function randomPosition(){

const positions=[

"CM","CM","CM",
"CB","CB","CB",

"ST","ST",

"LW","RW",

"CDM",

"LB","RB",

"CAM",

"GK"

];

return positions[Math.floor(Math.random()*positions.length)];

}

/* =====================================================
UTIL
===================================================== */

function random(min,max){
return Math.floor(Math.random()*(max-min+1))+min;
}

/* =====================================================
EXPORT
===================================================== */

module.exports = { generateScoutPlayers };