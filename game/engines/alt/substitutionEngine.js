function handleSubstitution({
  side,
  minute,
  state
}) {

  if (side.substitutions >= 5) return;

  const tiredPlayer = side.players
    .filter(p => !p.injured)
    .sort((a, b) => b.fatigue - a.fatigue)[0];

  if (!tiredPlayer) return;

  const benchPlayer = side.bench?.[0];
  if (!benchPlayer) return;

  // Wechsel durchführen
  side.players = side.players.filter(p => p._id !== tiredPlayer._id);
  side.players.push(benchPlayer);

  side.bench = side.bench.slice(1);
  side.substitutions++;

  state.events.push({
    minute,
    type: "substitution",
    out: tiredPlayer.lastName,
    in: benchPlayer.lastName
  });
}

module.exports = { handleSubstitution };