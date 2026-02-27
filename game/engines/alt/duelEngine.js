function resolveDuel({ attacker, defender }) {

  const attackScore =
    attacker.attributes.dribbling * 0.4 +
    attacker.attributes.speed * 0.3 +
    attacker.attributes.technique * 0.3;

  const defenseScore =
    defender.attributes.defending * 0.5 +
    defender.attributes.physical * 0.3 +
    defender.attributes.positioning * 0.2;

  return attackScore > defenseScore;
}

module.exports = { resolveDuel };