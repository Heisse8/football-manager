function calculateAttendance({
  stadiumCapacity,
  ticketPrice,
  homePosition,
  awayPosition,
  totalTeams
}) {

  // Tabellenfaktor eigenes Team
  const homeFactor = 1 - (homePosition - 1) / totalTeams;

  // Gegnerfaktor
  const opponentFactor = 1 - (awayPosition - 1) / totalTeams;

  // Spitzenspiel
  const topThreshold = 4;
  let bigMatchBonus = 0;

  if (homePosition <= topThreshold && awayPosition <= topThreshold) {
    bigMatchBonus = 0.1; // +10%
  }

  // Ticketpreisfaktor
  const priceFactor =
    ticketPrice <= 20 ? 1 :
    ticketPrice <= 35 ? 0.9 :
    ticketPrice <= 50 ? 0.75 : 0.6;

  // Grundnachfrage
  let demand =
    0.5 +
    homeFactor * 0.25 +
    opponentFactor * 0.15 +
    bigMatchBonus;

  demand = demand * priceFactor;

  // Begrenzen
  demand = Math.min(1, Math.max(0.2, demand));

  const attendance = Math.floor(stadiumCapacity * demand);
  const revenue = attendance * ticketPrice;

  return {
    attendance,
    revenue,
    demand
  };
}

module.exports = { calculateAttendance };