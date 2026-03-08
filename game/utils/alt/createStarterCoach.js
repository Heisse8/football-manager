function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createStarterCoach(clubId) {

  const formations = [
    "4-3-3",
    "4-4-2",
    "4-2-3-1",
    "3-5-2"
  ];

  const playstyles = [
    "Ballbesitz",
    "Kontern",
    "Gegenpressing",
    "Mauern"
  ];

  return {
    clubId,
    name: generateRandomName(), // falls du schon so eine Funktion hast
    age: randomBetween(35, 60),
    rating: 2.0,
    preferredFormation: randomFromArray(formations),
    playstyle: randomFromArray(playstyles)
  };
}