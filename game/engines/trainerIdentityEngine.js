function generateTrainerIdentity(trainer){

if(!trainer) return defaultIdentity()

const key = trainer.identityKey

switch(key){

case "guardiola":

return {
tempo:0.9,
pressing:1.1,
width:1.2,
directness:0.7,
risk:1.2,

buildUp:1.5,
possession:1.6,
counter:0.6,
defensiveBlock:0.8
}

case "klopp":

return {
tempo:1.4,
pressing:1.6,
width:1.2,
directness:1.3,
risk:1.2,

buildUp:0.8,
possession:0.9,
counter:1.6,
defensiveBlock:1
}

case "simeone":

return {
tempo:0.8,
pressing:0.9,
width:0.9,
directness:1.2,
risk:0.7,

buildUp:0.6,
possession:0.7,
counter:1.4,
defensiveBlock:1.6
}

case "de_zerbi":

return {
tempo:0.85,
pressing:1.05,
width:1,
directness:0.6,
risk:1.4,

buildUp:1.7,
possession:1.7,
counter:0.7,
defensiveBlock:0.9
}

default:
return defaultIdentity()

}

}

function defaultIdentity(){

return {

tempo:1,
pressing:1,
width:1,
directness:1,
risk:1,

buildUp:1,
possession:1,
counter:1,
defensiveBlock:1

}

}

module.exports = { generateTrainerIdentity }
