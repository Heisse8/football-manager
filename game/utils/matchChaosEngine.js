function applyMatchChaos(state, attacker, defender, goalkeeper){

const events = [];

/* =====================================
TORWARTFEHLER
===================================== */

if(goalkeeper && Math.random() < 0.015){

events.push({
type:"goalkeeper_error",
player:`${goalkeeper.firstName} ${goalkeeper.lastName}`
});

return {
chaosGoal:true,
events
};

}

/* =====================================
EIGENTOR
===================================== */

if(defender && Math.random() < 0.01){

events.push({
type:"own_goal",
player:`${defender.firstName} ${defender.lastName}`
});

return {
chaosGoal:true,
events
};

}

/* =====================================
ABGEFÄLSCHTER SCHUSS
===================================== */

if(Math.random() < 0.05){

events.push({
type:"deflection"
});

return {
xGMultiplier:1.4,
events
};

}

/* =====================================
LUCKY GOAL
===================================== */

if(Math.random() < 0.01){

events.push({
type:"lucky_goal"
});

return {
chaosGoal:true,
events
};

}

return {
xGMultiplier:1,
events
};

}

module.exports = { applyMatchChaos };