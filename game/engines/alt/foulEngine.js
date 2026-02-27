function handleFoul({
  attacker,
  defender,
  state,
  minute,
  zone
}) {

  if (!defender?.attributes) return;

  const aggression = defender.attributes.aggression || 50;

  let foulProbability =
    aggression * 0.003 +
    (zone?.includes("box") ? 0.05 : 0);

  if (Math.random() > foulProbability) return;

  const redChance = aggression > 85 ? 0.15 : 0.04;

  if (Math.random() < redChance) {

    state.events.push({
      minute,
      type: "red_card",
      player: defender.lastName
    });

    removePlayer(defender, state);
    return;
  }

  defender.yellowCards = (defender.yellowCards || 0) + 1;

  state.events.push({
    minute,
    type: "yellow_card",
    player: defender.lastName
  });

  if (defender.yellowCards >= 2) {

    state.events.push({
      minute,
      type: "red_card",
      player: defender.lastName
    });

    removePlayer(defender, state);
  }
}

function removePlayer(player, state) {

  if (state.home.players.some(p => p._id.equals(player._id))) {
    state.home.players =
      state.home.players.filter(p => !p._id.equals(player._id));
    state.home.redCards++;
  }

  if (state.away.players.some(p => p._id.equals(player._id))) {
    state.away.players =
      state.away.players.filter(p => !p._id.equals(player._id));
    state.away.redCards++;
  }
}

module.exports = { handleFoul };