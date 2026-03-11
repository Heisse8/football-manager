function calculateMarketValue(player){

let value = player.stars * 2000000;

/* Potential */

value += player.potential * 500000;

/* Alter */

if(player.age <= 21) value *= 1.5;
if(player.age >= 30) value *= 0.7;

/* Superstar Bonus */

if(player.stars >= 4.5) value *= 2;

return Math.round(value);

}

module.exports = { calculateMarketValue };