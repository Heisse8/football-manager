function calculateMarketValue(player){

let value = 0;

value += (player.stars || 1) * 200000;

value += (player.age < 23 ? 150000 : 0);

value += (player.shooting || 50) * 2000;
value += (player.pace || 50) * 2000;
value += (player.passing || 50) * 1500;
value += (player.defending || 50) * 1500;

value = Math.round(value);

return value;

}

module.exports = { calculateMarketValue };