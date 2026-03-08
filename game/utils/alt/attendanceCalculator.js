function calculateAttendance(team, matchImportance = "normal") {

let baseFill;

/* ================= FANBASE EINFLUSS ================= */

if (team.clubIdentity === "love") {

baseFill = 0.9;

} else {

baseFill = 0.65;

}

/* ================= SPIELTYP ================= */

if (matchImportance === "derby") baseFill += 0.1;
if (matchImportance === "top") baseFill += 0.05;
if (matchImportance === "crisis") baseFill -= 0.15;

/* ================= ZUFALL ================= */

const randomFactor = (Math.random() * 0.08) - 0.04;

const fillRate = Math.max(
0.3,
Math.min(1, baseFill + randomFactor)
);

/* ================= ZUSCHAUER ================= */

const attendance = Math.floor(
team.stadiumCapacity * fillRate
);

return attendance;

}

module.exports = { calculateAttendance };