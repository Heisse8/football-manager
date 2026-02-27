// =======================================
// OVERLOAD DETECTOR
// =======================================

const ZONES = [
  "LEFT_WING",
  "LEFT_HALFSPACE",
  "CENTER",
  "RIGHT_HALFSPACE",
  "RIGHT_WING"
];

function detectOverloads(zoneProfile, defensiveZoneProfile) {

  const result = {};

  ZONES.forEach(zone => {

    const attackValue = zoneProfile[zone] || 0;
    const defenseValue = defensiveZoneProfile[zone] || 0;

    const diff = attackValue - defenseValue;

    result[zone] = {
      overload: diff >= 1,
      underload: diff <= -1,
      neutral: diff === 0,
      diff
    };
  });

  return result;
}

module.exports = { detectOverloads };