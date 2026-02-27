// ======================================================
// DEFENSIVE ZONE PROFILE
// ======================================================

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

    const zone = defensiveZone(slot, entry.role);
    profile[zone] += 1;
  }

  // Defensive Line Modifier
  if (tactics?.defensiveLine === "tief") {
    profile.CENTER += 1;
  }

  if (tactics?.pressing === "hoch") {
    profile.LEFT_HALFSPACE += 0.5;
    profile.RIGHT_HALFSPACE += 0.5;
  }

  return profile;
}

function defensiveZone(slot, role) {

  if (["LW"].includes(slot)) return "LEFT_WING";
  if (["RW"].includes(slot)) return "RIGHT_WING";

  if (["LCB", "LB"].includes(slot)) return "LEFT_HALFSPACE";
  if (["RCB", "RB"].includes(slot)) return "RIGHT_HALFSPACE";

  return "CENTER";
}

module.exports = { buildDefensiveZoneProfile };