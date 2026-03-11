function applyTrainerImpact(ctx, coach){

if(!coach) return ctx;

const p = coach.philosophy || {};

ctx.attackStrength *= 1 + (p.tempo - 50) / 200;
ctx.defenseStrength *= 1 + (p.defensiveLine - 50) / 200;
ctx.possessionSkill *= 1 + (p.possession - 50) / 200;

return ctx;

}

module.exports = { applyTrainerImpact };