function determineAssistType(zone, chanceType, cutback, rebound){

if(rebound){
return "rebound"
}

if(cutback?.isCutback){
return "cutback"
}

if(chanceType === "through_ball"){
return "through_ball"
}

if(zone === "wing_left" || zone === "wing_right"){
if(Math.random() < 0.65){
return "cross"
}
}

if(chanceType === "dribble"){
return "dribble_create"
}

return "pass"
}

module.exports = { determineAssistType }