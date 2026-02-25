function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function splitGoals(totalGoals, breakdown) {
  const totalXG =
    breakdown.positional +
    breakdown.counter +
    breakdown.standard;

  if (totalXG <= 0) {
    return { positional: totalGoals, counter: 0, standard: 0 };
  }

  const positional = Math.round(
    totalGoals * (breakdown.positional / totalXG)
  );

  const counter = Math.round(
    totalGoals * (breakdown.counter / totalXG)
  );

  return {
    positional,
    counter,
    standard: Math.max(0, totalGoals - positional - counter)
  };
}

function simulate90Minutes({
  homePlayers,
  awayPlayers,
  breakdown,
  totalGoalsHome,
  totalGoalsAway
}) {

  const events = [];

  let homeScore = 0;
  let awayScore = 0;

  const homeSplit = splitGoals(totalGoalsHome, breakdown.home);
  const awaySplit = splitGoals(totalGoalsAway, breakdown.away);

  function createGoalEvent(minute, team, players, subtype) {

    const scorer = pickRandom(players);
    const assisterPool =
      players.filter(p => p._id !== scorer._id);

    const assister =
      assisterPool.length > 0
        ? pickRandom(assisterPool)
        : scorer;

    if (team === "home") homeScore++;
    else awayScore++;

    return {
      minute,
      type: "goal",
      subtype,
      team,
      scorer: `${scorer.firstName} ${scorer.lastName}`,
      assist: `${assister.firstName} ${assister.lastName}`,
      score: `${homeScore}-${awayScore}`
    };
  }

  function goalMinuteWithGameState(team) {

    const isLosing =
      (team === "home" && homeScore < awayScore) ||
      (team === "away" && awayScore < homeScore);

    const isWinning =
      (team === "home" && homeScore > awayScore) ||
      (team === "away" && awayScore > homeScore);

    // Rückstand → späte Tore wahrscheinlicher
    if (isLosing)
      return Math.floor(randomBetween(60, 95));

    // Führung → weniger Risiko, eher früher
    if (isWinning)
      return Math.floor(randomBetween(15, 70));

    return Math.floor(randomBetween(10, 90));
  }

  // =========================
  // TORE ERZEUGEN
  // =========================

  function processGoals(split, team, players) {

    for (let i = 0; i < split.positional; i++) {
      const minute = goalMinuteWithGameState(team);
      events.push(
        createGoalEvent(minute, team, players, "positional")
      );
    }

    for (let i = 0; i < split.counter; i++) {
      const minute = Math.floor(randomBetween(30, 85));
      events.push(
        createGoalEvent(minute, team, players, "counter")
      );
    }

    for (let i = 0; i < split.standard; i++) {
      const minute = Math.floor(randomBetween(5, 95));
      events.push(
        createGoalEvent(minute, team, players, "standard")
      );
    }
  }

  processGoals(homeSplit, "home", homePlayers);
  processGoals(awaySplit, "away", awayPlayers);

  // =========================
  // GELBE + ROTE KARTEN
  // =========================

  const totalGoals = totalGoalsHome + totalGoalsAway;
  const yellowCards = Math.floor(randomBetween(3, 6));

  for (let i = 0; i < yellowCards; i++) {

    const minute = Math.floor(randomBetween(10, 90));
    const team = Math.random() > 0.5 ? "home" : "away";

    const player =
      team === "home"
        ? pickRandom(homePlayers)
        : pickRandom(awayPlayers);

    events.push({
      minute,
      type: "yellow",
      team,
      player: `${player.firstName} ${player.lastName}`
    });

    // 10% Chance auf rot nach gelb
    if (Math.random() < 0.1) {
      events.push({
        minute: minute + 1,
        type: "red",
        team,
        player: `${player.firstName} ${player.lastName}`
      });
    }
  }

  // =========================
  // VERLETZUNGEN
  // =========================

  if (Math.random() < 0.15) {

    const minute = Math.floor(randomBetween(20, 85));
    const team = Math.random() > 0.5 ? "home" : "away";
    const player =
      team === "home"
        ? pickRandom(homePlayers)
        : pickRandom(awayPlayers);

    events.push({
      minute,
      type: "injury",
      team,
      player: `${player.firstName} ${player.lastName}`
    });
  }

  // =========================
  // NACHspielzeit Drama
  // =========================

  if (Math.random() < 0.3) {

    const team =
      homeScore === awayScore
        ? (Math.random() > 0.5 ? "home" : "away")
        : homeScore < awayScore
        ? "home"
        : "away";

    const players =
      team === "home" ? homePlayers : awayPlayers;

    events.push(
      createGoalEvent(
        Math.floor(randomBetween(90, 95)),
        team,
        players,
        "late_drama"
      )
    );
  }

  // =========================
  // SORTIEREN
  // =========================

  events.sort((a, b) => a.minute - b.minute);

  return events;
}

module.exports = { simulate90Minutes };