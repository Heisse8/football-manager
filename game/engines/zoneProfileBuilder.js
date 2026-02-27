// =======================================
// ZONE PROFILE BUILDER
// =======================================

const ZONES = {
  LEFT_WING: "LEFT_WING",
  LEFT_HALFSPACE: "LEFT_HALFSPACE",
  CENTER: "CENTER",
  RIGHT_HALFSPACE: "RIGHT_HALFSPACE",
  RIGHT_WING: "RIGHT_WING"
};


// =======================================
// SLOT → BASIS ZONE MAPPING
// =======================================

function baseZoneFromSlot(slot) {

  if (["LW"].includes(slot))
    return ZONES.LEFT_WING;

  if (["RW"].includes(slot))
    return ZONES.RIGHT_WING;

  if (["LB", "LWB", "LAM", "LST"].includes(slot))
    return ZONES.LEFT_HALFSPACE;

  if (["RB", "RWB", "RAM", "RST"].includes(slot))
    return ZONES.RIGHT_HALFSPACE;

  if (["LCM", "LDM"].includes(slot))
    return ZONES.LEFT_HALFSPACE;

  if (["RCM", "RDM"].includes(slot))
    return ZONES.RIGHT_HALFSPACE;

  if (["CAM", "CCM", "CDM", "CST", "CCB"].includes(slot))
    return ZONES.CENTER;

  if (["LCB"].includes(slot))
    return ZONES.LEFT_HALFSPACE;

  if (["RCB"].includes(slot))
    return ZONES.RIGHT_HALFSPACE;

  return ZONES.CENTER;
}


// =======================================
// ROLLEN-ZONEN-ANPASSUNG
// =======================================

function adjustZoneByRole(baseZone, role) {

  // Invers verschiebt Richtung Zentrum
  if (role === "inverser_aussenverteidiger")
    return ZONES.CENTER;

  if (role === "inverser_fluegel")
    return ZONES.CENTER;

  if (role === "falsche_9")
    return ZONES.CENTER;

  // Halbraumrollen bleiben bewusst im Halbraum
  if (role === "halbraumspieler")
    return baseZone.includes("LEFT")
      ? ZONES.LEFT_HALFSPACE
      : ZONES.RIGHT_HALFSPACE;

  if (role === "halbraumspieler_av")
    return baseZone.includes("LEFT")
      ? ZONES.LEFT_HALFSPACE
      : ZONES.RIGHT_HALFSPACE;

  // Wingback schiebt breit
  if (role === "wingback")
    return baseZone.includes("LEFT")
      ? ZONES.LEFT_WING
      : ZONES.RIGHT_WING;

  // Zielspieler bleibt zentral
  if (role === "zielspieler")
    return ZONES.CENTER;

  return baseZone;
}


// =======================================
// HAUPTFUNKTION
// =======================================

function buildZoneProfile(lineup) {

  const zoneProfile = {
    LEFT_WING: 0,
    LEFT_HALFSPACE: 0,
    CENTER: 0,
    RIGHT_HALFSPACE: 0,
    RIGHT_WING: 0
  };

  for (const slot in lineup) {

    const entry = lineup[slot];
    if (!entry?.role) continue;

    const baseZone = baseZoneFromSlot(slot);
    const finalZone = adjustZoneByRole(baseZone, entry.role);

    zoneProfile[finalZone] += 1;
  }

  return zoneProfile;
}

module.exports = { buildZoneProfile };