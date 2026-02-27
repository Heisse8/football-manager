// ============================================
// KOORDINATEN MODELL (0–100)
// y = 0 eigenes Tor
// y = 100 gegnerisches Tor
// x = 0 linker Flügel
// x = 100 rechter Flügel
// ============================================

function baseCoordinates(position) {
  const map = {
    GK: { x: 50, y: 5 },

    LCB: { x: 35, y: 20 },
    CB: { x: 50, y: 20 },
    RCB: { x: 65, y: 20 },

    LB: { x: 15, y: 25 },
    RB: { x: 85, y: 25 },

    DM: { x: 50, y: 40 },
    LCM: { x: 35, y: 50 },
    RCM: { x: 65, y: 50 },

    CAM: { x: 50, y: 65 },

    LW: { x: 15, y: 75 },
    RW: { x: 85, y: 75 },

    ST: { x: 50, y: 85 }
  };

  return map[position] || { x: 50, y: 50 };
}

// ============================================
// ROLLENBEWEGUNG (ERWEITERT)
// ============================================

function applyRoleMovement(coord, role) {
  const c = { ...coord };

  switch (role) {

    /* =========================
       INNENVERTEIDIGER
    ========================= */

    case "ballspielender_verteidiger":
      c.y += 5;
      break;

    case "innenverteidiger":
      break;

    /* =========================
       AUSSENVERTEIDIGER
    ========================= */

    case "inverser_aussenverteidiger":
      c.x = 50;
      c.y += 5;
      break;

    case "halbverteidiger":
      c.x = 50;
      break;

    case "wingback":
      c.y += 15;
      break;

    case "halbraumspieler_av":
      c.x = c.x < 50 ? 35 : 65;
      c.y += 10;
      break;

    /* =========================
       ZDM
    ========================= */

    case "tiefer_spielmacher":
      c.y += 5;
      break;

    case "zerstoerer":
      break;

    case "falsche_6":
      c.y -= 10;
      break;

    /* =========================
       ZM
    ========================= */

    case "spielmacher":
      break;

    case "box_to_box":
      c.y += 10;
      break;

    /* =========================
       ZOM
    ========================= */

    case "klassische_10":
      c.y += 5;
      break;

    case "schattenstuermer":
      c.y += 15;
      break;

    case "halbraumspieler":
      c.x = c.x < 50 ? 35 : 65;
      break;

    case "fluegel_ueberladen":
      c.x = c.x < 50 ? 20 : 80;
      break;

    /* =========================
       ST
    ========================= */

    case "zielspieler":
      c.y += 5;
      break;

    case "konterstuermer":
      c.y += 20;
      break;

    case "falsche_9":
      c.y -= 10;
      break;

    /* =========================
       WINGER
    ========================= */

    case "fluegelspieler":
      break;

    case "inverser_fluegel":
      c.x = 50;
      break;
  }

  return c;
}

// ============================================
// HAUPT INTERPRETER
// ============================================

function interpretStructure(lineup, players) {

  const structure = {
    zones: {
      defensiveLine: 0,
      buildUpLine: 0,
      midfieldLine: 0,
      attackingLine: 0
    },

    wingPresence: 0,
    halfspacePresence: 0,
    centralPresence: 0,

    finalLineOccupation: 0,
    restDefenseUnits: 0,

    verticalCompactness: 0,
    widthScore: 0,

    sideDistribution: {
      left: 0,
      right: 0,
      center: 0
    }
  };

  let minY = 100;
  let maxY = 0;

  for (const slot in lineup) {

    const entry = lineup[slot];
    if (!entry?.player || !entry?.role) continue;

    const player = players.find(
      p => p._id.toString() === entry.player.toString()
    );
    if (!player) continue;

    let coord = baseCoordinates(slot);
    coord = applyRoleMovement(coord, entry.role);

    // ⭐ Sterne verstärken vertikale Wirkung
    const starFactor =
      1 + ((player.starRating || 3) - 3) * 0.08;

    coord.y *= starFactor;

    // Für Duel Engine speichern
    player._simX = coord.x;
    player._simY = coord.y;

    minY = Math.min(minY, coord.y);
    maxY = Math.max(maxY, coord.y);

    // ================= Linien-Zuordnung =================

    if (coord.y < 25) {
      structure.zones.defensiveLine++;
      structure.restDefenseUnits++;
    }
    else if (coord.y < 45) {
      structure.zones.buildUpLine++;
      structure.restDefenseUnits++;
    }
    else if (coord.y < 70) {
      structure.zones.midfieldLine++;
    }
    else {
      structure.zones.attackingLine++;
      structure.finalLineOccupation++;
    }

    // ================= Seiten-Verteilung =================

    if (coord.x < 40) structure.sideDistribution.left++;
    else if (coord.x > 60) structure.sideDistribution.right++;
    else structure.sideDistribution.center++;

    // ================= Breite / Halbraum / Zentrum =================

    if (coord.x < 25 || coord.x > 75)
      structure.wingPresence++;
    else if (coord.x > 40 && coord.x < 60)
      structure.centralPresence++;
    else
      structure.halfspacePresence++;
  }

  structure.verticalCompactness = maxY - minY;
  structure.widthScore =
    structure.wingPresence - structure.centralPresence;

  return structure;
}

module.exports = { interpretStructure };