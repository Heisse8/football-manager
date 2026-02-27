function calculateZoneOverloads(lineup) {
  const overload = { left: 0, center: 0, right: 0 };

  Object.values(lineup).forEach(entry => {
    if (!entry) return;

    const slot = entry.slot || "";

    if (slot.includes("L")) overload.left++;
    else if (slot.includes("R")) overload.right++;
    else overload.center++;
  });

  return overload;
}

module.exports = { calculateZoneOverloads };