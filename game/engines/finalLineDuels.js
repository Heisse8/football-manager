function getLastLinePlayers(structure, players, side = "attack") {
  if (side === "attack") {
    return players.filter(p => p._simY > 75);
  }
  return players.filter(p => p._simY < 30);
}

// echtes Matching nach Zone (links / rechts / zentral)
function matchDefender(attacker, defenders) {

  if (!defenders.length) return null;

  // links
  if (attacker._simX < 40) {
    return defenders.find(d => d._simX < 40) || defenders[0];
  }

  // rechts
  if (attacker._simX > 60) {
    return defenders.find(d => d._simX > 60) || defenders[0];
  }

  // zentral
  return defenders.find(d => d._simX >= 40 && d._simX <= 60) || defenders[0];
}

function duelScore(attacker, defender) {

  const attack =
    attacker.rating * 0.4 +
    (attacker.dribbling || 50) * 0.2 +
    (attacker.finishing || 50) * 0.2 +
    (attacker.pace || 50) * 0.2;

  const defense =
    defender.rating * 0.4 +
    (defender.defending || 50) * 0.4 +
    (defender.physical || 50) * 0.2;

  return (attack - defense) / 60;
}

function evaluateFinalLineDuels(homeStructure, awayStructure, homePlayers, awayPlayers) {

  const homeAttackers = getLastLinePlayers(homeStructure, homePlayers, "attack");
  const awayDefenders = getLastLinePlayers(awayStructure, awayPlayers, "defense");

  let total = 0;

  homeAttackers.forEach(attacker => {

    const defender = matchDefender(attacker, awayDefenders);
    if (!defender) return;

    total += duelScore(attacker, defender);
  });

  return total;
}

module.exports = { evaluateFinalLineDuels };