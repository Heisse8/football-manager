function applyCoachTactics(ctx, coach){

if(!coach?.coachDNA) return ctx

const dna = coach.coachDNA

ctx.tempoModifier = (ctx.tempoModifier || 1) * (0.8 + dna.tempo * 0.4)
ctx.pressModifier = (ctx.pressModifier || 1) * (0.8 + dna.pressing * 0.4)
ctx.widthModifier = (ctx.widthModifier || 1) * (0.8 + dna.width * 0.4)
ctx.directModifier = (ctx.directModifier || 1) * (0.8 + dna.directness * 0.4)
ctx.riskModifier = (ctx.riskModifier || 1) * (0.8 + dna.risk * 0.4)

return ctx
}

module.exports = { applyCoachTactics }
