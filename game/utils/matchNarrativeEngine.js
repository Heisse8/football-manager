function generateMatchNarrative(state){

const homeGoals = state.home.goals
const awayGoals = state.away.goals

const shotsHome = state.home.shots
const shotsAway = state.away.shots

const xGHome = state.home.xG.toFixed(2)
const xGAway = state.away.xG.toFixed(2)

const tiltHome = Math.round(
(state.territory.home /
(state.territory.home + state.territory.away || 1)) * 100
)

let story = []

// Result
story.push(
`The match ended ${homeGoals}-${awayGoals}.`
)

// xG narrative
if(xGHome > xGAway){
story.push(
`The home side created the better chances (${xGHome} xG vs ${xGAway}).`
)
}else if(xGAway > xGHome){
story.push(
`The away team generated more expected goals (${xGAway} xG vs ${xGHome}).`
)
}

// Shots narrative
story.push(
`Shots: ${shotsHome}-${shotsAway}.`
)

// Territory
if(tiltHome > 60){
story.push("The home team dominated territory.")
}

if(tiltHome < 40){
story.push("The away side controlled most attacking areas.")
}

// Big chances
if(state.bigChances.home + state.bigChances.away > 0){

story.push(
`Big chances: ${state.bigChances.home}-${state.bigChances.away}.`
)

}

return story.join(" ")

}

module.exports = { generateMatchNarrative }