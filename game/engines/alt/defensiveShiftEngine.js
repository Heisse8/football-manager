function calculateDefensiveShift({ overloadMatrix, defensiveShape }) {

  if (defensiveShape === "BACK_4" && overloadMatrix.left >= 3) {
    return { shiftSide: "left", centerExposed: true };
  }

  if (defensiveShape === "BACK_4" && overloadMatrix.right >= 3) {
    return { shiftSide: "right", centerExposed: true };
  }

  return { shiftSide: null, centerExposed: false };
}

module.exports = { calculateDefensiveShift };