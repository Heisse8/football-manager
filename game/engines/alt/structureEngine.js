function detectDefensiveLine(lineup) {
  const defenders = ["LB","LCB","CCB","RCB","RB"];
  const active = defenders.filter(slot => lineup[slot]);

  if (active.length === 4) return "BACK_4";
  if (active.length === 3) return "BACK_3";
  if (active.length === 5) return "BACK_5";

  return "HYBRID";
}

module.exports = { detectDefensiveLine };