function applyTrainerSubstitutions(state, ctx){

if(state.minute < 60) return

ctx.subsMade += 1

if(ctx.subsMade >= 5) return

const isHome = ctx === state.homeCtx

const goalsFor = isHome ? state.home.goals : state.away.goals
const goalsAgainst = isHome ? state.away.goals : state.home.goals

const diff = goalsFor - goalsAgainst

const players = ctx.players
const bench = ctx.bench || []

if(bench.length === 0) return


/* ======================================================
 MÜDE SPIELER
====================================================== */

const tiredPlayers = players.filter(p => (p.fitness || 100) < 70)

/* ======================================================
 WECHSEL WAHRSCHEINLICHKEIT
====================================================== */

let subChance = 0.05

if(state.minute > 70) subChance += 0.05
if(state.minute > 80) subChance += 0.08

// Rückstand → mehr Wechsel
if(diff < 0) subChance += 0.08

// Führung → defensive Wechsel
if(diff > 0) subChance += 0.03

if(Math.random() > subChance) return

/* ======================================================
 SPIELER RAUS
====================================================== */

let outPlayer =
tiredPlayers[Math.floor(Math.random()*tiredPlayers.length)]

if(!outPlayer){
outPlayer = players[Math.floor(Math.random()*players.length)]
}

/* ======================================================
 PASSENDER ERSATZ
====================================================== */

const candidates = bench.filter(p =>
(p.positions || []).some(pos =>
outPlayer.positions?.includes(pos)
)
)

if(candidates.length === 0) return

const sub = candidates[Math.floor(Math.random()*candidates.length)]

/* ======================================================
 WECHSEL
====================================================== */

ctx.players = ctx.players.map(p =>
p._id.toString() === outPlayer._id.toString() ? sub : p
)

ctx.bench = ctx.bench.filter(p =>
p._id.toString() !== sub._id.toString()
)

ctx.bench.push(outPlayer)

state.events.push({
minute:state.minute,
type:"substitution",
out:`${outPlayer.firstName} ${outPlayer.lastName}`,
in:`${sub.firstName} ${sub.lastName}`
})

}

module.exports = { applyTrainerSubstitutions }
