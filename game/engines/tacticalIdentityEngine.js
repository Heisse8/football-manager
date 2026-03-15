function generateTacticalIdentity(team){

if(team.tacticalIdentity){
return team.tacticalIdentity
}

const identity = {

possessionBias: 0.9 + Math.random()*0.3,
counterBias: 0.9 + Math.random()*0.3,
tempoBias: 0.9 + Math.random()*0.3,
wingBias: 0.9 + Math.random()*0.3,
centralBias: 0.9 + Math.random()*0.3

}

team.tacticalIdentity = identity

return identity

}

function applyTacticalIdentity(ctx, identity){

if(!identity) return

ctx.possessionStrength *= identity.possessionBias
ctx.attackStrength *= identity.tempoBias

ctx.identity = identity

}

module.exports = {
generateTacticalIdentity,
applyTacticalIdentity
}