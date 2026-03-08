function generateEventText(event) {

  if (event.type === "goal") {

    if (event.goalType === "counter") {
      return `${event.minute}. ⚡ ${event.scorer} trifft nach einem schnellen Konter (Vorlage: ${event.assist}).`;
    }

    if (event.goalType === "standard") {
      return `${event.minute}. 🎯 ${event.scorer} trifft nach einer Standardsituation (Vorlage: ${event.assist}).`;
    }

    return `${event.minute}. ${event.scorer} erzielt das Tor (Vorlage: ${event.assist}).`;
  }

  if (event.type === "yellow") {
    return `${event.minute}. 🟨 Gelbe Karte für ${event.player}.`;
  }

  return "";
}

function generateMatchTicker(events) {
  return events.map(e => generateEventText(e));
}

module.exports = { generateMatchTicker };