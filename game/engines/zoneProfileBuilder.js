 // ======================================================
// ZONE PROFILE BUILDER
// ======================================================

const ZONES = [
  "LEFT_WING",
  "LEFT_HALFSPACE",
  "CENTER",
  "RIGHT_HALFSPACE",
  "RIGHT_WING"
];

function buildZoneProfile(lineup) {

  const profile = createEmptyZoneProfile();

  for (const slot in lineup) {
    const entry = lineup[slot];
    if (!entry?.role) continue;

    const zone = determineZone(slot, entry.role);
    profile[zone] += 1;
  }

  return profile;
}

function determineZone(slot, role) {

  if (["LW"].includes(slot)) return "LEFT_WING";
  if (["RW"].includes(slot)) return "RIGHT_WING";
  if (["LCB", "LB", "LDM", "LCM"].includes(slot)) return "LEFT_HALFSPACE";
  if (["RCB", "RB", "RDM", "RCM"].includes(slot)) return "RIGHT_HALFSPACE";

  if (role === "inverser_fluegel") return "CENTER";
  if (role === "falsche_9") return "CENTER";

  return "CENTER";
}

function createEmptyZoneProfile() {
  return {
    LEFT_WING: 0,
    LEFT_HALFSPACE: 0,
    CENTER: 0,
    RIGHT_HALFSPACE: 0,
    RIGHT_WING: 0
  };
}

module.exports = { buildZoneProfile };