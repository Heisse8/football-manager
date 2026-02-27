const roleConfig = {

ballspielender_verteidiger: { line: "defense", moveY: 5 },
klassischer_verteidiger: { line: "defense" },

inverser_verteidiger: { line: "defense", moveCenter: true },
halbverteidiger: { line: "defense", backThree: true },
wingback: { line: "defense", moveY: 15 },
halbraum_av: { line: "defense", moveHalfspace: true },

tiefer_spielmacher: { line: "midfield", moveY: 5 },
zerstoerer: { line: "midfield" },
tiefer_sechser: { line: "midfield", dropBetweenCB: true },

spielmacher: { line: "midfield" },
box_to_box: { line: "midfield", moveY: 10 },
falscher_fluegel: { line: "midfield", moveHalfspace: true },

klassischer_10: { line: "attack", moveY: 5 },
schattenstuermer: { line: "attack", moveY: 15 },
halbraumspieler: { line: "attack", moveHalfspace: true },

winger: { line: "attack" },
inverser_fluegel: { line: "attack", moveCenter: true },

zielspieler: { line: "attack", moveY: 5 },
konterstuermer: { line: "attack", moveY: 20 },
falsche_9: { line: "attack", dropDeep: true }

};

module.exports = { roleConfig };