function getZoneDefender({
  zone,
  defendingPlayers,
  defendingZones,
  defensiveShift
}) {

  // 1️⃣ Normaler Verteidiger in dieser Zone
  let defender = defendingPlayers.find(
    p => defendingZones[p.position] === zone
  );

  // 2️⃣ Wenn Shift aktiv (z.B. Überladung links)
  if (defensiveShift && defensiveShift.zone === zone) {

    const shiftedDefender = defendingPlayers.find(
      p => p.position === defensiveShift.shiftedPlayerPosition
    );

    if (shiftedDefender) {
      defender = shiftedDefender;
    }
  }

  return defender;
}

module.exports = { getZoneDefender };