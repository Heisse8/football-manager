function calculateMarketValue(player){

let baseValue = 0;

/* ⭐ Rating Einfluss */

baseValue += player.stars * 2000000;

/* 👶 Alter */

if(player.age <= 20){

baseValue *= 1.6;

}
else if(player.age <= 24){

baseValue *= 1.4;

}
else if(player.age <= 28){

baseValue *= 1.2;

}
else if(player.age <= 31){

baseValue *= 1;

}
else if(player.age <= 34){

baseValue *= 0.7;

}
else{

baseValue *= 0.4;

}

/* ⚽ Performance */

if(player.seasonStats){

const goals = player.seasonStats.goals || 0;
const assists = player.seasonStats.assists || 0;
const games = player.seasonStats.games || 0;

/* Tore */

baseValue += goals * 500000;

/* Vorlagen */

baseValue += assists * 350000;

/* viele Einsätze */

if(games > 25){

baseValue *= 1.15;

}

}

/* ⭐ Sterne Bonus */

if(player.stars >= 4.5){

baseValue *= 1.3;

}

/* 💰 Rundung */

return Math.round(baseValue);

}

module.exports = {
calculateMarketValue
};