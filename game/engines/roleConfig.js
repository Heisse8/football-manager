const roleConfig = {

  /* =========================
     INNENVERTEIDIGER
  ========================= */

  innenverteidiger: {
    line: "defense",
    movement: { y: 0 }
  },

  ballspielender_verteidiger: {
    line: "defense",
    movement: { y: 5 }
  },

  /* =========================
     AUSSENVERTEIDIGER
  ========================= */

  inverser_aussenverteidiger: {
    line: "defense",
    movement: { xToCenter: true, y: 5 }
  },

  halbverteidiger: {
    line: "defense",
    movement: { xToCenter: true }
  },

  wingback: {
    line: "defense",
    movement: { y: 15 }
  },

  av_halbraum: {
    line: "defense",
    movement: { halfspace: true, y: 10 }
  },

  /* =========================
     ZDM
  ========================= */

  tiefer_spielmacher: {
    line: "midfield",
    movement: { y: 5 },
    buildUpBonus: 2
  },

  zerstoerer: {
    line: "midfield",
    restDefenseBonus: 2
  },

  falsche_6: {
    line: "midfield",
    movement: { y: -10 }
  },

  /* =========================
     ZM
  ========================= */

  spielmacher: {
    line: "midfield",
    buildUpBonus: 2
  },

  box_to_box: {
    line: "midfield",
    movement: { y: 10 }
  },

  /* =========================
     ZOM
  ========================= */

  klassische_10: {
    line: "attack",
    movement: { y: 5 }
  },

  schattenstuermer: {
    line: "attack",
    movement: { y: 15 }
  },

  halbraumspieler: {
    line: "attack",
    movement: { halfspace: true }
  },

  fluegel_ueberladen: {
    line: "attack",
    movement: { overloadWing: true }
  },

  /* =========================
     ST
  ========================= */

  zielspieler: {
    line: "attack",
    movement: { y: 5 }
  },

  konterstuermer: {
    line: "attack",
    movement: { y: 20 }
  },

  falsche_9: {
    line: "attack",
    movement: { y: -10 }
  },

  /* =========================
     WINGER
  ========================= */

  fluegelspieler: {
    line: "attack",
    movement: { y: 5 }
  },

  inverser_fluegel: {
    line: "attack",
    movement: { xToCenter: true }
  }
};

module.exports = { roleConfig };