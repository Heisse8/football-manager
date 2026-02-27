// =======================================
// DEFENSIVE ZONE PROFILE BUILDER
// =======================================

const ZONES = {
  LEFT_WING: "LEFT_WING",
  LEFT_HALFSPACE: "LEFT_HALFSPACE",
  CENTER: "CENTER",
  RIGHT_HALFSPACE: "RIGHT_HALFSPACE",
  RIGHT_WING: "RIGHT_WING"
};


// =======================================
// SLOT → DEFENSIVE BASIS ZONE
// =======================================

function defensiveBaseZone(slot) {

  if (["LW"].includes(slot))
    return ZONES.LEFT_WING;

  if (["RW"].includes(slot))
    return ZONES.RIGHT_WING;

  if (["LB", "LCB", "LDM", "LCM"].includes(slot))
    return ZONES.LEFT_HALFSPACE;

  if (["RB", "RCB", "RDM", "RCM"].includes(slot))
    return ZONES.RIGHT_HALFSPACE;

  if (["CDM", "CCM", "CAM", "CST", "CCB"].includes(slot))
    return ZONES.CENTER;

  return ZONES.CENTER;
}


// =======================================
// ROLLEN-DEFENSIVVERHALTEN
// =======================================

function adjustDefensiveZone(baseZone, role) {

  // Inverse Rollen rücken enger ins Zentrum
  if (role === "inverser_aussenverteidiger")
    return ZONES.CENTER;

  if (role === "inverser_fluegel")
    return ZONES.CENTER;

  // Wingback steht defensiv breiter
  if (role === "wingback")
    return baseZone.includes("LEFT")
      ? ZONES.LEFT_WING
      : ZONES.RIGHT_WING;

  // Halbverteidiger bleibt im Halbraum
  if (role === "halbverteidiger")
    return baseZone;

  // Falsche 9 verteidigt zentral
  if (role === "falsche_9")
    return ZONES.CENTER;

  return baseZone;
}


// =======================================
// HAUPTFUNKTION
// =======================================

function buildDefensiveZoneProfile(lineup, tactics) {

  const profile = {
    LEFT_WING: 0,
    LEFT_HALFSPACE: 0,
    CENTER: 0,
    RIGHT_HALFSPACE: 0,
    RIGHT_WING: 0
  };

  for (const slot in lineup) {

    const entry = lineup[slot];
    if (!entry?.role) continue;

    const baseZone = defensiveBaseZone(slot);
    const finalZone = adjustDefensiveZone(baseZone, entry.role);

    profile[finalZone] += 1;
  }

  // 🔹 Defensive Line Einfluss
  if (tactics.defensiveLine === "tief") {
    profile.CENTER += 1;
  }

  if (tactics.defensiveLine === "hoch") {
    profile.LEFT_WING += 0.5;
    profile.RIGHT_WING += 0.5;
  }

  // 🔹 Pressing verschiebt Fokus
  if (tactics.pressing === "hoch") {
    profile.LEFT_HALFSPACE += 0.5;
    profile.RIGHT_HALFSPACE += 0.5;
  }

  return profile;
}

module.exports = { buildDefensiveZoneProfile };