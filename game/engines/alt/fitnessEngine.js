function applyWeeklyLoad(team, matches) {

  team.players.forEach(p => {

    if (p.injured) return;

    let drain = 0.02 * matches;

    if (p.role === "BoxToBox") drain += 0.01 * matches;
    if (team.pressing === "high") drain += 0.01 * matches;

    p.fitness -= drain;

    if (p.fitness < 0.75) p.fitness = 0.75;
  });

  // Verletzungslogik (Ø 3–5 pro Saison)
  const avgFitness =
    team.players.reduce((s, p) => s + p.fitness, 0) / 11;

  let risk = 0.10 + (1 - avgFitness) * 0.3;

  if (Math.random() < risk) {
    const healthy = team.players.filter(p => !p.injured);
    if (healthy.length) {
      const p = healthy[Math.floor(Math.random() * healthy.length)];
      p.injured = true;
      p.injuryWeeks = 1 + Math.floor(Math.random() * 4);
    }
  }

  // Heilung & Regeneration
  team.players.forEach(p => {
    if (p.injured) {
      p.injuryWeeks--;
      if (p.injuryWeeks <= 0) {
        p.injured = false;
        p.fitness = 0.9;
      }
    } else {
      p.fitness += 0.05;
      if (p.fitness > 1) p.fitness = 1;
    }
  });
}

module.exports = { applyWeeklyLoad };