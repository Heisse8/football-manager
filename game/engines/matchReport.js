function generateMatchReport(homeTeam, awayTeam, result) {

  const { homeGoals, awayGoals, stats } = result;

  let text = "";

  /* =========================
     EINLEITUNG
  ========================= */

  if (homeGoals > awayGoals) {
    text += `${homeTeam.name} gewinnt mit ${homeGoals}:${awayGoals} gegen ${awayTeam.name}. `;
  } else if (awayGoals > homeGoals) {
    text += `${awayTeam.name} setzt sich mit ${awayGoals}:${homeGoals} gegen ${homeTeam.name} durch. `;
  } else {
    text += `Zwischen ${homeTeam.name} und ${awayTeam.name} endet die Partie ${homeGoals}:${awayGoals}. `;
  }

  /* =========================
     BALLBESITZ
  ========================= */

  if (stats.possession.home > stats.possession.away) {
    text += `${homeTeam.name} hatte mit ${stats.possession.home}% mehr Ballbesitz. `;
  } else if (stats.possession.away > stats.possession.home) {
    text += `${awayTeam.name} kontrollierte mit ${stats.possession.away}% weite Teile des Spiels. `;
  }

  /* =========================
     CHANCEN & xG
  ========================= */

  text += `Insgesamt verzeichnete ${homeTeam.name} ${stats.shots.home} Schüsse (${stats.xG.home} xG), `;
  text += `${awayTeam.name} kam auf ${stats.shots.away} Abschlüsse (${stats.xG.away} xG). `;

  if (stats.shotsOnTarget.home > stats.shotsOnTarget.away) {
    text += `${homeTeam.name} war dabei zielstrebiger vor dem Tor. `;
  } else if (stats.shotsOnTarget.away > stats.shotsOnTarget.home) {
    text += `${awayTeam.name} brachte mehr Bälle auf das Tor. `;
  }

  /* =========================
     SCHLUSSPHASE
  ========================= */

  if (Math.abs(homeGoals - awayGoals) === 1) {
    text += `Die Partie blieb bis zum Schluss spannend. `;
  }

  if (stats.substitutions.home + stats.substitutions.away > 0) {
    text += `Insgesamt wurden ${stats.substitutions.home + stats.substitutions.away} Wechsel vorgenommen. `;
  }

  /* =========================
     FAZIT
  ========================= */

  if (homeGoals === awayGoals) {
    text += `Am Ende ein gerechtes Unentschieden.`;
  } else if (stats.xG.home > stats.xG.away && homeGoals < awayGoals) {
    text += `Trotz besserer Chancenverwertung blieb ${homeTeam.name} ohne Sieg.`;
  } else if (stats.xG.away > stats.xG.home && awayGoals < homeGoals) {
    text += `Effizienz machte hier den Unterschied zugunsten von ${homeTeam.name}.`;
  } else {
    text += `Ein verdienter Sieg unter dem Strich.`;
  }

  return text;
}

module.exports = { generateMatchReport };