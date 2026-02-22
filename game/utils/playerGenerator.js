function randomName() {
  const first = ["Max", "Luca", "Tim", "Jonas", "Leon", "Paul"];
  const last = ["Müller", "Schmidt", "Becker", "Wagner", "Fischer"];
  return first[Math.floor(Math.random()*first.length)] + " " +
         last[Math.floor(Math.random()*last.length)];
}

function randomRating() {
  return Math.floor(Math.random() * 30) + 60; // 60-90
}

function generateSquad() {
  const positions = [
    "GK",
    "LB","CB","CB","RB",
    "CM","CM","CAM",
    "LW","RW",
    "ST","ST",
    "CDM","CB","LB","RB","CM","ST"
  ];

  return positions.map(pos => ({
    name: randomName(),
    position: pos,
    rating: randomRating(),
    isStarting: false
  }));
}

module.exports = { generateSquad };