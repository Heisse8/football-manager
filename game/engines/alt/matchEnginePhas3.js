export function calculateTeamStrength({
  lineup,
  players,
  defensiveShape,
  buildUpShape,
  overloadMatrix,
  roleProfiles,
  playstyle
}) {

  let attackScore = 0;
  let defenseScore = 0;
  let controlScore = 0;

  Object.keys(lineup).forEach(slotId => {
    const entry = lineup[slotId];
    if (!entry) return;

    const player = players.find(p => p._id === entry.player);
    if (!player) return;

    const roleData = roleProfiles[entry.role];

    // Grundstärke
    const base = player.stars * 10;

    // Rollenmodifikator
    const widthImpact = roleData?.width || 0.5;
    const depthImpact = roleData?.depth || 0.5;

    attackScore += base * depthImpact;
    defenseScore += base * (1 - depthImpact);
    controlScore += base * widthImpact;
  });

  // Überladungen beeinflussen Angriff
  attackScore += overloadMatrix.left * 5;
  attackScore += overloadMatrix.center * 8;
  attackScore += overloadMatrix.right * 5;

  // Defensive Struktur Bonus
  if (defensiveShape === "5_chain") defenseScore += 15;
  if (defensiveShape === "4_chain") defenseScore += 8;

  // Build-Up Struktur Bonus
  if (buildUpShape === "3-2-5") controlScore += 12;
  if (buildUpShape === "2-3-5") controlScore += 8;

  return {
    attack: Math.round(attackScore),
    defense: Math.round(defenseScore),
    control: Math.round(controlScore)
  };
}