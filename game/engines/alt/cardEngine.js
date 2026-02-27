function checkCard(defenders) {

  if (Math.random() > 0.03) return null;

  const player =
    defenders[Math.floor(Math.random() * defenders.length)];

  const redChance = player.attributes.aggression > 85 ? 0.2 : 0.05;

  if (Math.random() < redChance) {
    return { type: "red", player };
  }

  return { type: "yellow", player };
}

module.exports = { checkCard };