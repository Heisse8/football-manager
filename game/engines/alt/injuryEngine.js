function handleInjury({ player, state }) {

  const injuryRisk =
    (100 - player.attributes.stamina) * 0.0005;

  if (Math.random() < injuryRisk) {

    player.isInjured = true;

    const teamSide =
      state.home.players.includes(player) ? "home" : "away";

    state[teamSide].injuries++;

    state.events.push({
      minute: state.minute,
      type: "injury",
      player: player.lastName
    });
  }
}

module.exports = { handleInjury };