function mapShapeToZones(lineup, roleProfiles) {
  const zones = {
    leftWing: null,
    leftHalf: null,
    center: null,
    rightHalf: null,
    rightWing: null
  };

  Object.entries(lineup).forEach(([slot, data]) => {
    const role = data.role;
    const profile = roleProfiles[role];
    if (!profile) return;

    const zone = profile.inPossession || profile.outOfPossession;

    if (zone.includes("left_wing")) zones.leftWing = slot;
    else if (zone.includes("left_half")) zones.leftHalf = slot;
    else if (zone.includes("right_wing")) zones.rightWing = slot;
    else if (zone.includes("right_half")) zones.rightHalf = slot;
    else zones.center = slot;
  });

  return zones;
}

module.exports = { mapShapeToZones };