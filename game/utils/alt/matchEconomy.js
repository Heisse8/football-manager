const Stadium = require("../models/Stadium");

function calculateAttendance({
  capacity,
  ticketPrice,
  homePosition,
  awayPosition
}) {

  const tableFactor = 1 - (homePosition - 1) / 18;
  const opponentFactor = 1 - (awayPosition - 1) / 18;

  const priceFactor =
    ticketPrice <= 20 ? 1 :
    ticketPrice <= 35 ? 0.9 :
    ticketPrice <= 50 ? 0.75 : 0.6;

  let demand =
    0.55 +
    tableFactor * 0.25 +
    opponentFactor * 0.15;

  demand *= priceFactor;

  demand = Math.min(1, Math.max(0.25, demand));

  const attendance = Math.floor(capacity * demand);
  const revenue = attendance * ticketPrice;

  return { attendance, revenue, fillRate: attendance / capacity };
}

function calculateHomeAdvantage(fillRate, capacity) {

  let advantage = 0.05; // Grundwert 5%

  advantage += fillRate * 0.1;

  if (capacity > 40000) advantage += 0.02;

  return advantage;
}

module.exports = {
  calculateAttendance,
  calculateHomeAdvantage
};