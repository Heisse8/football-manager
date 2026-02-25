// ============================================
// SYSTEM DETECTOR (ENGINE READY)
// ============================================

function detectSystem(structureRaw, lineup) {

  let defenders = 0;
  let midfielders = 0;
  let attackers = 0;

  for (const slot in lineup) {

    const role = lineup[slot]?.role;
    if (!role) continue;

    /* =========================
       DEFENSE
    ========================= */

    if ([
      "innenverteidiger",
      "ballspielender_verteidiger",
      "inverser_aussenverteidiger",
      "halbverteidiger",
      "wingback",
      "halbraumspieler_av"
    ].includes(role)) {
      defenders++;
      continue;
    }

    /* =========================
       MIDFIELD
    ========================= */

    if ([
      "tiefer_spielmacher",
      "zerstoerer",
      "falsche_6",
      "spielmacher",
      "box_to_box"
    ].includes(role)) {
      midfielders++;
      continue;
    }

    /* =========================
       ATTACK
    ========================= */

    if ([
      "klassische_10",
      "schattenstuermer",
      "halbraumspieler",
      "fluegel_ueberladen",
      "zielspieler",
      "konterstuermer",
      "falsche_9",
      "fluegelspieler",
      "inverser_fluegel"
    ].includes(role)) {
      attackers++;
      continue;
    }

    // Fallback (falls neue Rolle vergessen wurde)
    midfielders++;
  }

  return `${defenders}-${midfielders}-${attackers}`;
}

module.exports = { detectSystem };