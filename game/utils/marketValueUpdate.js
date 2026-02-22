function updateMarketValue(player, isSeasonEnd = false) {

  let changeFactor = 1;

  /* =========================
     FORM BASIERT
  ========================= */

  const performanceScore =
    (player.seasonGoals * 0.04) +
    (player.seasonAssists * 0.03);

  changeFactor += performanceScore;

  /* Schlechte Saison */
  if (player.seasonGoals === 0 && player.seasonAssists === 0) {
    changeFactor -= 0.05;
  }

  /* =========================
     ALTERSEFFEKT (nur Saisonende)
  ========================= */

  if (isSeasonEnd) {

    if (player.age <= 23) {
      changeFactor += 0.08; // Talent-Bonus
    }

    if (player.age >= 30) {
      changeFactor -= 0.10; // Altersverlust
    }

    // Alter steigt nach Saison
    player.age += 1;
  }

  /* =========================
     NEUER MARKTWERT
  ========================= */

  let newValue = Math.round(player.marketValue * changeFactor);

  // Untergrenze & Obergrenze
  if (newValue < 100000) newValue = 100000;
  if (newValue > 200000000) newValue = 200000000;

  player.marketValue = newValue;

  // Saisonstats resetten
  if (isSeasonEnd) {
    player.seasonGoals = 0;
    player.seasonAssists = 0;
  }
}

module.exports = { updateMarketValue };