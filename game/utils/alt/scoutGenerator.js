const Scout = require("../../models/Scout");
const Transfer = require("../../models/Transfer");

function randomName(){

const first = [
"Carlos","Luis","Mateo","Rafael","Diego",
"Marco","Antonio","Julian","Thomas","David"
];

const last = [
"Silva","Costa","Fernandez","Lopez",
"Garcia","Torres","Mendes","Santos"
];

return first[Math.floor(Math.random()*first.length)] +
" " +
last[Math.floor(Math.random()*last.length)];

}

function generateStars(){

const roll = Math.random();

if(roll < 0.50) return 1;
if(roll < 0.75) return 2;
if(roll < 0.90) return 3;
if(roll < 0.98) return 4;

return 5; // sehr selten
}

async function spawnScouts(amount = 3){

for(let i=0;i<amount;i++){

const stars = generateStars();

const scout = await Scout.create({

name: randomName(),
stars,
region: "global",
team: null

});

const end = new Date();
end.setHours(end.getHours()+24);

await Transfer.create({

type:"scout",
item: scout._id,

seller: null,

startPrice: 200000 * stars,
currentBid: 200000 * stars,

status:"active",

expiresAt: end

});

console.log("🧑‍💼 Neuer Scout auf Markt:", scout.name, stars,"⭐");

}

}

module.exports = { spawnScouts };