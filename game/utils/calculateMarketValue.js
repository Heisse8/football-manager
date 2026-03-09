function calculateMarketValue(player){

let value = 0;

/* =====================================================
BASISWERT (STARS)
===================================================== */

value += (player.stars || 1) * 500000;

/* =====================================================
ATTRIBUTE EINFLUSS
===================================================== */

value += (player.shooting || 50) * 2500;
value += (player.pace || 50) * 2200;
value += (player.passing || 50) * 2000;
value += (player.defending || 50) * 2000;
value += (player.physical || 50) * 1500;
value += (player.mentality || 50) * 1500;

/* =====================================================
ALTER
Peak: 24 - 29
===================================================== */

if(player.age < 21){
value *= 1.25;
}
else if(player.age <= 24){
value *= 1.15;
}
else if(player.age <= 29){
value *= 1.10;
}
else if(player.age <= 32){
value *= 0.90;
}
else if(player.age <= 35){
value *= 0.70;
}
else{
value *= 0.45;
}

/* =====================================================
POTENTIAL BONUS
===================================================== */

if(player.potential && player.potential > player.stars){

const diff = player.potential - player.stars;

value *= 1 + (diff * 0.12);

}

/* =====================================================
POSITION WERT
===================================================== */

if(player.positions){

if(player.positions.includes("ST")){
value *= 1.10;
}

if(player.positions.includes("CAM")){
value *= 1.08;
}

if(player.positions.includes("CB")){
value *= 1.05;
}

if(player.positions.includes("GK")){
value *= 0.95;
}

}

/* =====================================================
MINIMUM MARKTWERT
===================================================== */

value = Math.max(20000,value);

/* =====================================================
RUNDEN
===================================================== */

value = Math.round(value);

return value;

}

module.exports = { calculateMarketValue };