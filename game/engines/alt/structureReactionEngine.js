function applyStructureReaction({
    imbalance,
    state
}) {

if (!imbalance) return state;

if (imbalance.effect === "RCB_steps_out") {
    state.defensiveShift = "right_gap_open";
}

if (imbalance.effect === "CCB_isolated") {
    state.isolatedCenterBack = true;
}

return state;
}

module.exports = { applyStructureReaction };