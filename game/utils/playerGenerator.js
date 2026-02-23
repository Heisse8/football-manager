const Player = require("../models/Player");

// ================= NAME POOLS =================

const firstNames = [
  "Liam","Noah","Elias","Lucas","Mateo","Ben","Julian","Leon",
  "Mohamed","David","Jonas","Arthur","Theo","Samuel","Felix",
  "Marco","Enzo","Gabriel","Luis","Adam","Nico","Oliver"
];

const lastNamesPool = [
  "Müller","Schmidt","Schneider","Fischer","Weber","Wagner",
  "Becker","Hoffmann","Schäfer","Koch","Richter","Klein",
  "Wolf","Schröder","Neumann","Braun","Hofmann","Zimmermann",
  "Alvarez","Silva","Fernandez","Costa","Martinez","Santos",
  "Smith","Johnson","Brown","Taylor","Anderson","Clark",
  "Garcia","Lopez","Martins","Diallo","Kovacic","Ibrahimovic",
  "Haaland","Mbappe","Bellingham","Modric","Kante","Ramos"
];

// ================= POSITIONS =================

const basePositions = [
  "GK",
  "RB","CB","CB","LB",
  "CM","CM","CAM",
  "RW","ST","LW"
];

const positionGroups = {
  GK: ["GK"],
  RB: ["RB","RWB"],
  LB: ["LB","LWB"],
  CB: ["CB"],
  CM: ["CM","CDM"],
  CAM: ["CAM","CM"],
  RW: ["RW","RM"],
  LW: ["LW","LM"],
  ST: ["ST"]
};

// ================= STAR DISTRIBUTION =================
// Maximal 2.5 Sterne – fairer Liga-Start

const starDistribution = [
  2,2,2,2,2,2,2,2,      // 8x 2 Sterne
  2.5,2.5,2.5,          // 3x 2.5 Sterne
  1.5,1.5,1.5,1.5,1.5,  // 5x 1.5 Sterne
  1,1                   // 2x 1 Stern
];

// ================= ALTER =================

function generateAge(index) {

  if (index < 2) {
    return 18 + Math.floor(Math.random() * 3); // 18–20
  }

  if (index < 8) {
    return 23 + Math.floor(Math.random() * 5); // 23–27
  }

  if (index < 15) {
    return 28 + Math.floor(Math.random() * 4); // 28–31
  }

  return 32 + Math.floor(Math.random() * 3); // 32–34
}

// ================= NATIONALITY =================

function getNationality(league) {
  const rand = Math.random();

  if (league.startsWith("GER") && rand < 0.5) return "Deutschland";
  if (league.startsWith("ENG") && rand < 0.5) return "England";

  const countries = [
    "Frankreich","Spanien","Brasilien","Argentinien",
    "Portugal","Niederlande","Belgien","Kroatien",
    "USA","Japan","Nigeria","Senegal"
  ];

  return countries[Math.floor(Math.random() * countries.length)];
}

// ================= ATTRIBUTE LOGIC =================

function randomAround(base) {
  return Math.max(20, Math.min(85, Math.floor(base + (Math.random()*8 - 4))));
}

function generateAttributes(stars, position) {

  const base = 35 + stars * 10; 
  // bewusst niedriger gehalten → keine 4-Sterne-Werte

  let attrs = {
    pace: randomAround(base),
    shooting: randomAround(base),
    passing: randomAround(base),
    defending: randomAround(base),
    physical: randomAround(base),
    mentality: randomAround(base)
  };

  switch(position) {

    case "GK":
      attrs.defending += 10;
      attrs.physical += 5;
      attrs.shooting -= 20;
      break;

    case "CB":
      attrs.defending += 10;
      attrs.physical += 8;
      attrs.shooting -= 10;
      break;

    case "RB":
    case "LB":
      attrs.pace += 6;
      attrs.defending += 5;
      break;

    case "CM":
    case "CAM":
      attrs.passing += 8;
      attrs.mentality += 5;
      break;

    case "RW":
    case "LW":
      attrs.pace += 10;
      attrs.shooting += 5;
      break;

    case "ST":
      attrs.shooting += 12;
      attrs.pace += 5;
      break;
  }

  return attrs;
}

// ================= MAIN GENERATOR =================

async function generatePlayersForTeam(team) {

  const usedLastNames = new Set();
  const players = [];

  for (let i = 0; i < 18; i++) {

    // Einzigartiger Nachname
    let lastName;
    do {
      lastName = lastNamesPool[Math.floor(Math.random() * lastNamesPool.length)];
    } while (usedLastNames.has(lastName));

    usedLastNames.add(lastName);

    const mainPosition = basePositions[i % basePositions.length];
    const positions = positionGroups[mainPosition];

    const stars = starDistribution[i];
    const age = generateAge(i);

    const attributes = generateAttributes(stars, mainPosition);

    const player = new Player({
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName,
      nationality: getNationality(team.league),
      age,
      positions,
      stars,
      ...attributes,
      team: team._id
    });

    players.push(player);
  }

  await Player.insertMany(players);
}

module.exports = { generatePlayersForTeam };