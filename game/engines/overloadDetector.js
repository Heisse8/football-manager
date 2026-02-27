// ======================================================
// OVERLOAD DETECTOR
// ======================================================

const ZONES = [
  "LEFT_WING",
  "LEFT_HALFSPACE",
  "CENTER",
  "RIGHT_HALFSPACE",
  "RIGHT_WING"
];

function detectOverloads(attackProfile, defenseProfile) {

  const result = {};

  ZONES.forEach(zone => {

    const attack = attackProfile[zone] || 0;
    const defense = defenseProfile[zone] || 0;

    const diff = attack - defense;

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