function getDefensiveOpponent({
  attackingPosition,
  defensiveShape
}) {

  if (defensiveShape === "BACK_4") {

    const mapping = {
      LW: "RB",
      RW: "LB",
      ST: "LCB",
      CAM: "CDM"
    };

    return mapping[attackingPosition] || "CB";
  }

  if (defensiveShape === "BACK_3") {

    const mapping = {
      LW: "RCB",
      RW: "LCB",
      ST: "CCB",
      CAM: "CDM"
    };

    return mapping[attackingPosition] || "CCB";
  }

  if (defensiveShape === "BACK_5") {

    const mapping = {
      LW: "RWB",
      RW: "LWB",
      ST: "CCB",
      CAM: "CDM"
    };

    return mapping[attackingPosition] || "CB";
  }

  return "CB";
}

module.exports = { getDefensiveOpponent };