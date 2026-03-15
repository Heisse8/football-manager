function applyTransitionMoment(state){

if(Math.random() > 0.18){
return false
}

state.events.push({
minute:state.minute,
type:"transition"
})

return true

}

module.exports = { applyTransitionMoment }