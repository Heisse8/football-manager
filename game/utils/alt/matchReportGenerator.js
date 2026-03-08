function randomMinute() {
  return Math.floor(Math.random() * 90) + 1;
}

function weightedRandomPlayer(players, type) {

  const weighted = players.map(p => {

    let weight = 1;

    if (type === "scorer") {
      weight =
        (p.shooting || 50) * 0.5 +
        (p.pace || 50) * 0.2 +
        (p.stars || 2.5) * 10;
    }

    if (type === "assist") {
      weight =
        (p.passing || 50) * 0.6 +
        (p.mentality || 50) * 0.4;
    }

    if (type === "card") {
      weight =
        100 - (p.mentality || 50);
    }

    return { player: p, weight };
  });

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  let random = Math.random() * totalWeight;

  for (const entry of weighted) {
    random -= entry.weight;
    if (random <= 0) return entry.player;
  }

  return players[0];
}


function generateMatchReport({ match, homePlayers, awayPlayers, result }) {

  const events = [];

  // ================= TORE =================

  for (let i = 0; i < result.homeGoals; i++) {

    const scorer = weightedRandomPlayer(homePlayers, "scorer");
    const assister = weightedRandomPlayer(homePlayers, "assist");

    const minute = randomMinute();

    let goalText = `⚽ ${scorer.lastName} trifft`;

    if (Math.random() < 0.3 && scorer.physical > 70) {
      goalText += " per Kopf";
    } else if (Math.random() < 0.3 && scorer.shooting > 75) {
      goalText += " mit einem Distanzschuss";
    }

    goalText += ` nach Vorlage von ${assister.lastName}!`;

    events.push({
      minute,
      type: "goal",
      team: "home",
      player: `${scorer.firstName} ${scorer.lastName}`,
      assist: `${assister.firstName} ${assister.lastName}`,
      text: goalText
    });
  }

  for (let i = 0; i < result.awayGoals; i++) {

    const scorer = weightedRandomPlayer(awayPlayers, "scorer");
    const assister = weightedRandomPlayer(awayPlayers, "assist");

    const minute = randomMinute();

    let goalText = `⚽ ${scorer.lastName} trifft`;

    if (Math.random() < 0.3 && scorer.physical > 70) {
      goalText += " per Kopf";
    } else if (Math.random() < 0.3 && scorer.shooting > 75) {
      goalText += " mit einem Distanzschuss";
    }

    goalText += ` nach Vorlage von ${assister.lastName}!`;

    events.push({
      minute,
      type: "goal",
      team: "away",
      player: `${scorer.firstName} ${scorer.lastName}`,
      assist: `${assister.firstName} ${assister.lastName}`,
      text: goalText
    });
  }

  // ================= GELBE KARTEN =================

  const yellowCount = Math.floor(Math.random() * 4);

  for (let i = 0; i < yellowCount; i++) {

    const teamSide = Math.random() < 0.5 ? "home" : "away";
    const players = teamSide === "home" ? homePlayers : awayPlayers;

    const player = weightedRandomPlayer(players, "card");

    events.push({
      minute: randomMinute(),
      type: "yellow",
      team: teamSide,
      player: `${player.firstName} ${player.lastName}`,
      text: `🟨 Gelbe Karte für ${player.lastName}`
    });
  }

  // ================= ROTE KARTE =================

  if (Math.random() < 0.07) {

    const teamSide = Math.random() < 0.5 ? "home" : "away";
    const players = teamSide === "home" ? homePlayers : awayPlayers;

    const player = weightedRandomPlayer(players, "card");

    events.push({
      minute: randomMinute(),
      type: "red",
      team: teamSide,
      player: `${player.firstName} ${player.lastName}`,
      text: `🟥 Rote Karte! ${player.lastName} fliegt vom Platz!`
    });
  }

  events.sort((a, b) => a.minute - b.minute);

  return { events };
}

module.exports = { generateMatchReport };