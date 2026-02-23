function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function simulate90Minutes({
  homePlayers,
  awayPlayers,
  breakdown, // positional, counter, standard
  totalGoalsHome,
  totalGoalsAway
}) {

  const events = [];

  // =========================
  // 1️⃣ GOAL MINUTES GENERIEREN
  // =========================

  function generateGoalMinutes(totalGoals) {
    const minutes = [];
    for (let i = 0; i < totalGoals; i++) {
      minutes.push(Math.floor(randomBetween(5, 90)));
    }
    return minutes.sort((a, b) => a - b);
  }

  const homeGoalMinutes = generateGoalMinutes(totalGoalsHome);
  const awayGoalMinutes = generateGoalMinutes(totalGoalsAway);

  // =========================
  // 2️⃣ TORE ERZEUGEN
  // =========================

  function createGoalEvent(minute, team, players) {

    const scorer = pickRandom(players);
    const assister = pickRandom(players.filter(p => p._id !== scorer._id));

    return {
      minute,
      type: "goal",
      team,
      scorer: `${scorer.firstName} ${scorer.lastName}`,
      assist: `${assister.firstName} ${assister.lastName}`
    };
  }

  homeGoalMinutes.forEach(min =>
    events.push(createGoalEvent(min, "home", homePlayers))
  );

  awayGoalMinutes.forEach(min =>
    events.push(createGoalEvent(min, "away", awayPlayers))
  );

  // =========================
  // 3️⃣ GELBE KARTEN
  // =========================

  const yellowCards = Math.floor(randomBetween(2, 6));

  for (let i = 0; i < yellowCards; i++) {
    const minute = Math.floor(randomBetween(10, 90));
    const team = Math.random() > 0.5 ? "home" : "away";
    const player = team === "home"
      ? pickRandom(homePlayers)
      : pickRandom(awayPlayers);

    events.push({
      minute,
      type: "yellow",
      team,
      player: `${player.firstName} ${player.lastName}`
    });
  }

  // =========================
  // 4️⃣ SORTIEREN
  // =========================

  events.sort((a, b) => a.minute - b.minute);

  return events;
}

module.exports = { simulate90Minutes };