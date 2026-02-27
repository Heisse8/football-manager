function simulateMinute({ state, homeAnalysis, awayAnalysis }) {

  const { home, away, minute } = state;

  /* =============================
     1️⃣ POSSESSION LOGIC
  ============================== */

  let homePossessionChance =
    homeAnalysis.possession /
    (homeAnalysis.possession + awayAnalysis.possession);

  if (homeAnalysis.tactics.style === "ballbesitz")
    homePossessionChance += 0.05;

  if (awayAnalysis.tactics.style === "ballbesitz")
    homePossessionChance -= 0.05;

  if (homeAnalysis.tactics.style === "mauern")
    homePossessionChance -= 0.05;

  homePossessionChance = clamp(homePossessionChance, 0.2, 0.8);

  const isHomeAttacking = Math.random() < homePossessionChance;

  const attacking = isHomeAttacking ? home : away;
  const defending = isHomeAttacking ? away : home;
  const attackingAnalysis = isHomeAttacking ? homeAnalysis : awayAnalysis;

  attacking.possession++;

  /* =============================
     2️⃣ CHANCE PROBABILITY
  ============================== */

  let chanceProbability =
    attackingAnalysis.chanceCreation * 0.015;

  // Tempo Einfluss
  if (attackingAnalysis.tactics.tempo === "hoch")
    chanceProbability *= 1.15;

  if (attackingAnalysis.tactics.tempo === "niedrig")
    chanceProbability *= 0.85;

  // Konter Bonus
  if (attackingAnalysis.tactics.style === "konter")
    chanceProbability *= 1.2;

  // Mauern Malus
  if (attackingAnalysis.tactics.style === "mauern")
    chanceProbability *= 0.6;

  if (Math.random() > chanceProbability) return;

  /* =============================
     3️⃣ xG CALCULATION
  ============================== */

  const xGvalue =
    0.1 +
    attackingAnalysis.chanceCreation * 0.01 +
    Math.random() * 0.3;

  attacking.xG += xGvalue;

  /* =============================
     4️⃣ GOAL DECISION
  ============================== */

  if (Math.random() < xGvalue) {

    attacking.goals++;

    state.events.push({
      minute,
      type: "goal",
      team: isHomeAttacking ? "home" : "away"
    });
  }

  /* =============================
     5️⃣ FOUL / CARDS (LIGHT)
  ============================== */

  const foulChance = 0.03;

  if (Math.random() < foulChance) {

    const yellowChance = 0.7;
    const redChance = 0.1;

    if (Math.random() < redChance) {

      defending.red++;

      state.events.push({
        minute,
        type: "red_card",
        team: isHomeAttacking ? "away" : "home"
      });

    } else if (Math.random() < yellowChance) {

      defending.yellow++;

      state.events.push({
        minute,
        type: "yellow_card",
        team: isHomeAttacking ? "away" : "home"
      });
    }
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

module.exports = { simulateMinute };