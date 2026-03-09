async function generatePlayersForTeam(team) {

const usedLastNames = new Set();
const players = [];

for (let i = 0; i < 22; i++) {

let lastName;

do {
lastName = lastNamesPool[Math.floor(Math.random() * lastNamesPool.length)];
} while (usedLastNames.has(lastName));

usedLastNames.add(lastName);

const mainPosition = basePositions[i % basePositions.length];
const positions = positionGroups[mainPosition];

const stars = starDistribution[i % starDistribution.length];
const age = generateAge(i);

const attributes = generateAttributes(stars, mainPosition);

/* Potential */

const potential = Math.min(5, stars + Math.random()*1.5);

/* Marktwert */

const marketValue = Math.round(
stars * 300000 +
(attributes.shooting + attributes.pace) * 2000
);

const player = new Player({

firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
lastName,

nationality: getNationality(team.league),

age,
positions,

stars,
potential,

marketValue,

...attributes,

team: team._id

});

players.push(player);

}

await Player.insertMany(players);
}