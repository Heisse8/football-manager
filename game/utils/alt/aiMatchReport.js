function generateKickerStyleReport(match) {

  const {
    homeTeam,
    awayTeam,
    homeGoals,
    awayGoals,
    possession,
    xG,
    events
  } = match;

  const homeName = homeTeam.name;
  const awayName = awayTeam.name;

  let intro = "";
  let analysis = "";
  let drama = "";
  let conclusion = "";

  // ================= EINLEITUNG =================

  if (homeGoals > awayGoals) {
    intro = `${homeName} gewinnt mit ${homeGoals}:${awayGoals} gegen ${awayName}.`;
  } else if (homeGoals < awayGoals) {
    intro = `${awayName} setzt sich mit ${awayGoals}:${homeGoals} bei ${homeName} durch.`;
  } else {
    intro = `${homeName} und ${awayName} trennen sich ${homeGoals}:${awayGoals}.`;
  }

  // ================= SPIELANALYSE =================

  if (possession.home > 60) {
    analysis = `${homeName} dominierte das Spielgeschehen mit ${possession.home}% Ballbesitz.`;
  } else if (possession.away > 60) {
    analysis = `${awayName} hatte mit ${possession.away}% deutlich mehr Ballbesitz.`;
  } else {
    analysis = `Die Partie war über weite Strecken ausgeglichen.`;
  }

  if (xG.home > xG.away + 1) {
    analysis += ` Auch die xG-Werte (${xG.home} zu ${xG.away}) sprechen klar für die Hausherren.`;
  } else if (xG.away > xG.home + 1) {
    analysis += ` Die Gäste erspielten sich die besseren Chancen (xG ${xG.away} zu ${xG.home}).`;
  }

  // ================= DRAMATIK =================

  const lateGoal = events.find(e => e.type === "goal" && e.minute >= 80);

  if (lateGoal) {
    drama = ` Die Entscheidung fiel spät: In der ${lateGoal.minute}. Minute sorgte ${lateGoal.player} für die Vorentscheidung.`;
  }

  const redCard = events.find(e => e.type === "red");

  if (redCard) {
    drama += ` Ein Wendepunkt war die Rote Karte gegen ${redCard.player}.`;
  }

  // ================= FAZIT =================

  if (Math.abs(homeGoals - awayGoals) >= 3) {
    conclusion = ` Am Ende war es ein deutlicher Klassenunterschied.`;
  } else if (homeGoals === awayGoals) {
    conclusion = ` Ein gerechtes Unentschieden.`;
  } else {
    conclusion = ` Insgesamt ein verdienter Sieg.`;
  }

  return `${intro}\n\n${analysis}${drama}\n\n${conclusion}`;
}

module.exports = { generateKickerStyleReport };