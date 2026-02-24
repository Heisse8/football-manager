function detectSystem(structureRaw, lineup) {

  let defenders = 0;
  let midfielders = 0;
  let attackers = 0;

  for (const slot in lineup) {
    const role = lineup[slot]?.role;
    if (!role) continue;

    // Defensive Rollen
    if (
      role.includes("verteidiger") ||
      role === "half_back"
    ) {
      defenders++;
      continue;
    }

    // Offensive Rollen
    if (
      role.includes("stuermer") ||
      role.includes("fluegel") ||
      role === "zielspieler"
    ) {
      attackers++;
      continue;
    }

    // Rest = Mittelfeld
    midfielders++;
  }

  return `${defenders}-${midfielders}-${attackers}`;
}

module.exports = { detectSystem };