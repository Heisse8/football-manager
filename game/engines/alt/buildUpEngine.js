export function calculateBuildUpShape(lineup, roleProfiles) {
  const shape = [];

  Object.entries(lineup).forEach(([slot, data]) => {
    const role = data.role;
    const profile = roleProfiles[role];

    if (!profile) {
      shape.push({ slot, position: slot });
      return;
    }

    shape.push({
      slot,
      position: profile.inPossession,
      width: profile.width,
      depth: profile.depth
    });
  });

  return shape;
}