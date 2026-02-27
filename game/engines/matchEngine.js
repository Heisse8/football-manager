// ======================================================
// MATCH ENGINE – STABLE SERVER VERSION
// kompatibel mit matchScheduler
// ======================================================

function simulateRealisticMatch({ homeTeam, awayTeam }) {

  const homeCtx = buildTeamContext(homeTeam);
  const awayCtx = buildTeamContext(awayTeam);

  const state = createInitialState();

  for (let minute = 1; minute <= 90; minute++) {
    state.minute = minute;
    simulateMinute(state, homeCtx, awayCtx);
  }

  const possession = calculatePossession(state);

  return {
    result: {
      homeGoals: state.home.goals,
      awayGoals: state.away.goals
    },
    xG: {
      home: round(state.home.xG),
      away: round(state.away.xG)
    },
    possession,
    stats: buildStats(state),
    events: state.events
  };
}

module.exports = { simulateRealisticMatch };

function createInitialState() {
  return {
    minute: 0,
    events: [],
    home: baseTeamState(),
    away: baseTeamState()
  };
}

function baseTeamState() {
  return {
    goals: 0,
    xG: 0,
    control: 0,
    shots: 0,
    yellows: 0,
    reds: 0,
    corners: 0,
    freeKicks: 0,
    penalties: 0
  };
}

function simulateMinute(state, homeCtx, awayCtx) {

  state.home.control += homeCtx.possessionSkill / 1100;
  state.away.control += awayCtx.possessionSkill / 1100;

  const homeAttacks = Math.random() < 0.5;

  const attacking = homeAttacks ? state.home : state.away;
  const defending = homeAttacks ? state.away : state.home;

  const attackCtx = homeAttacks ? homeCtx : awayCtx;
  const defendCtx = homeAttacks ? awayCtx : homeCtx;

  runAttack(state, attacking, defending, attackCtx, defendCtx);

  maybeCorner(state, attacking, attackCtx, defendCtx);
  maybeFreeKick(state, attacking, attackCtx);
  maybePenalty(state, attacking, attackCtx);
  maybeYellow(state, attacking);
}

function runAttack(state, attacking, defending, attackCtx, defendCtx) {

  if (!phaseDuel(
    attackCtx.attackStrength,
    defendCtx.defenseStrength
  )) return;

  const xG = 0.05 + Math.random() * 0.35;

  attacking.xG += xG;
  attacking.shots++;

  if (Math.random() < xG) {
    attacking.goals++;
    state.events.push({
      minute: state.minute,
      type: "goal"
    });
  }
}

function maybeCorner(state, team, attackCtx, defendCtx) {

  if (Math.random() > 0.055) return;

  team.corners++;

  const xG = 0.04 + Math.random() * 0.05;

  team.xG += xG;
  team.shots++;

  if (Math.random() < xG) {
    team.goals++;
    state.events.push({
      minute: state.minute,
      type: "corner_goal"
    });
  }
}

function maybeFreeKick(state, team, ctx) {

  if (Math.random() > 0.03) return;

  team.freeKicks++;

  const xG = 0.05 + Math.random() * 0.08;

  team.xG += xG;
  team.shots++;

  if (Math.random() < xG) {
    team.goals++;
    state.events.push({
      minute: state.minute,
      type: "freekick_goal"
    });
  }
}

function maybePenalty(state, team, ctx) {

  if (Math.random() > 0.0005) return;

  team.penalties++;

  const success = 0.75 + Math.random() * 0.1;

  team.xG += 0.76;
  team.shots++;

  if (Math.random() < success) {
    team.goals++;
    state.events.push({
      minute: state.minute,
      type: "penalty_goal"
    });
  }
}

function maybeYellow(state, team) {

  if (Math.random() > 0.0025) return;

  team.yellows++;

  state.events.push({
    minute: state.minute,
    type: "yellow"
  });
}

function maybeRed(state, team) {

  if (Math.random() > 0.0003) return;

  team.reds++;

  state.events.push({
    minute: state.minute,
    type: "red"
  });
}

function calculatePossession(state) {
  const total = state.home.control + state.away.control;
  const home = total > 0 ? (state.home.control / total) * 100 : 50;

  return {
    home: Math.round(home),
    away: Math.round(100 - home)
  };
}

function buildStats(state) {
  return {
    shots: { home: state.home.shots, away: state.away.shots },
    corners: { home: state.home.corners, away: state.away.corners },
    freeKicks: { home: state.home.freeKicks, away: state.away.freeKicks },
    penalties: { home: state.home.penalties, away: state.away.penalties },
    cards: {
      home: { yellows: state.home.yellows, reds: state.home.reds },
      away: { yellows: state.away.yellows, reds: state.away.reds }
    }
  };
}

function round(n) {
  return Number(n.toFixed(2));
}

function phaseDuel(a, d) {
  const base = a / (a + d);
  return (base + Math.random() * 0.15) > 0.5;
}