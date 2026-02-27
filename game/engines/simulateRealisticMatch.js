// ======================================================
// MATCH ENGINE V3.4 – STRUCTURE FINAL
// Schema-kompatibel + minimalistische Architektur
// ======================================================

function simulateRealisticMatch({ homeTeam, awayTeam }) {

  const homeCtx = buildTeamContext(homeTeam);
  const awayCtx = buildTeamContext(awayTeam);

  const state = {
    minute: 0,
    home: {
      goals: 0,
      xG: 0,
      control: 0,
      shots: 0,
      yellows: 0,
      reds: 0,
      corners: 0,
      freeKicks: 0,
      penalties: 0
    },
    away: {
      goals: 0,
      xG: 0,
      control: 0,
      shots: 0,
      yellows: 0,
      reds: 0,
      corners: 0,
      freeKicks: 0,
      penalties: 0
    }
  };

  for (let minute = 1; minute <= 90; minute++) {
    state.minute = minute;
    simulateMinute(state, homeCtx, awayCtx);
  }

  const totalControl = state.home.control + state.away.control;

  const homePoss = totalControl > 0
    ? (state.home.control / totalControl) * 100
    : 50;

  return {
    homeGoals: state.home.goals,
    awayGoals: state.away.goals,

    xG: {
      home: round(state.home.xG),
      away: round(state.away.xG)
    },

    possession: {
      home: Math.round(homePoss),
      away: Math.round(100 - homePoss)
    },

    stats: {
      shots: {
        home: state.home.shots,
        away: state.away.shots
      },
      corners: {
        home: state.home.corners,
        away: state.away.corners
      },
      freeKicks: {
        home: state.home.freeKicks,
        away: state.away.freeKicks
      },
      penalties: {
        home: state.home.penalties,
        away: state.away.penalties
      },
      cards: {
        home: {
          yellows: state.home.yellows,
          reds: state.home.reds
        },
        away: {
          yellows: state.away.yellows,
          reds: state.away.reds
        }
      }
    },

    events: [] // später echtes Event-System
  };
}

module.exports = { simulateRealisticMatch };


// ======================================================
// TEAM CONTEXT
// ======================================================

function buildTeamContext(team) {

  const phaseStrength = calculatePhaseStrength(team);
  const avgPace = averageAttribute(team.lineup, "pace");

  const possessionSkill =
    (
      averageAttribute(team.lineup, "passing") +
      averageAttribute(team.lineup, "technique") +
      averageAttribute(team.lineup, "composure")
    ) / 3;

  const possessionBias =
    team.tactics.style === "ballbesitz" ? 6 :
    team.tactics.style === "mauern" ? -4 :
    0;

  return {
    phaseStrength,
    avgPace,
    possessionSkill,
    possessionBias,
    lineup: team.lineup,
    tactics: team.tactics
  };
}


// ======================================================
// MINUTE SIMULATION
// ======================================================

function simulateMinute(state, homeCtx, awayCtx) {

  state.home.control += homeCtx.possessionSkill / 1100;
  state.away.control += awayCtx.possessionSkill / 1100;

  state.home.control += homeCtx.possessionBias / 90;
  state.away.control += awayCtx.possessionBias / 90;

  const cycles = Math.max(
    tempoCycles(homeCtx.tactics.tempo),
    tempoCycles(awayCtx.tactics.tempo)
  );

  for (let i = 0; i < cycles; i++) {

    const homeAttacks = Math.random() < 0.5;

    const attacking = homeAttacks ? state.home : state.away;
    const defending = homeAttacks ? state.away : state.home;

    const attackCtx = homeAttacks ? homeCtx : awayCtx;
    const defendCtx = homeAttacks ? awayCtx : homeCtx;

    runAttack(attacking, defending, attackCtx, defendCtx);
  }

  // Standards
  maybeCorner(state.home, homeCtx, awayCtx);
  maybeCorner(state.away, awayCtx, homeCtx);

  maybeFreeKick(state.home, homeCtx);
  maybeFreeKick(state.away, awayCtx);

  maybePenalty(state.home, homeCtx);
  maybePenalty(state.away, awayCtx);

  // Karten
  maybeYellow(state.home, homeCtx);
  maybeYellow(state.away, awayCtx);
}


// ======================================================
// ATTACK PHASE
// ======================================================

function runAttack(attacking, defending, attackCtx, defendCtx) {

  if (!phaseDuel(
    attackCtx.phaseStrength.buildup,
    defendCtx.phaseStrength.pressing
  )) return;

  attacking.control++;

  if (!phaseDuel(
    attackCtx.phaseStrength.progression,
    defendCtx.phaseStrength.restDefense
  )) return;

  attacking.control++;

  if (!phaseDuel(
    attackCtx.phaseStrength.finalThird,
    defendCtx.phaseStrength.restDefense
  )) return;

  const xG =
    (attackCtx.phaseStrength.finalThird / 130) * 0.45 +
    Math.random() * 0.07;

  attacking.xG += xG;
  attacking.shots++;

  if (Math.random() < xG)
    attacking.goals++;
}


// ======================================================
// SET PIECES
// ======================================================

function maybeCorner(team, attackCtx, defendCtx) {

  if (Math.random() > 0.055) return;

  team.corners++;

  const aerial =
    (attackCtx.phaseStrength.finalThird -
      defendCtx.phaseStrength.restDefense) / 220;

  const xG = Math.max(0, 0.05 + aerial * 0.05);

  team.xG += xG;
  team.shots++;

  if (Math.random() < xG)
    team.goals++;
}

function maybeFreeKick(team, ctx) {

  if (Math.random() > 0.03) return;

  team.freeKicks++;

  const quality = ctx.phaseStrength.finalThird / 150;

  const xG = 0.06 + quality * 0.06;

  team.xG += xG;
  team.shots++;

  if (Math.random() < xG)
    team.goals++;
}

function maybePenalty(team, ctx) {

  if (Math.random() > 0.0004) return;

  team.penalties++;

  const quality = ctx.phaseStrength.finalThird / 100;
  const success = 0.72 + (quality - 0.5) * 0.2;

  const xG = 0.76;

  team.xG += xG;
  team.shots++;

  if (Math.random() < success)
    team.goals++;
}


// ======================================================
// CARDS (simple weighted logic)
// ======================================================

const yellowWeights = {
  CB: 1.4,
  LB: 1.3,
  RB: 1.3,
  CDM: 1.5,
  CM: 1.1,
  CAM: 0.9,
  ST: 0.8,
  WINGER: 0.7
};

function maybeYellow(team, ctx) {

  if (Math.random() > 0.0025) return;

  const player =
    ctx.lineup[Math.floor(Math.random() * ctx.lineup.length)];

  const basePos = player.positions?.[0] || "CM";
  const weight = yellowWeights[basePos] || 1;

  if (Math.random() < weight / 2)
    team.yellows++;
}


// ======================================================
// HELPERS
// ======================================================

function phaseDuel(a, d) {
  const base = a / (a + d);
  return (base + Math.random() * 0.18) > 0.55;
}

function tempoCycles(tempo) {
  if (tempo === "hoch") return Math.random() < 0.3 ? 2 : 1;
  if (tempo === "niedrig") return Math.random() < 0.25 ? 0 : 1;
  return 1;
}

function avg(...nums) {
  const valid = nums.filter(n => typeof n === "number");
  if (!valid.length) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

function averageAttribute(lineup, attr) {
  const values = lineup
    .map(p => p.attributes?.[attr])
    .filter(v => typeof v === "number");

  if (!values.length) return 70;

  return values.reduce((a, b) => a + b, 0) / values.length;
}

function round(n) {
  return Number(n.toFixed(2));
}