function calculateHomeAdvantage(attendance, capacity) {

  const fillRate = attendance / capacity;

  let advantage = 0.05; // 5% Basis

  // Stimmung
  advantage += fillRate * 0.1;

  // Großes Stadion Bonus
  if (capacity > 40000) {
    advantage += 0.02;
  }

  return advantage; // z.B. 0.12 = +12%
}

module.exports = { calculateHomeAdvantage };