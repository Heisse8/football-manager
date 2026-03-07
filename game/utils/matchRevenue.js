const { calculateAttendance } = require("./attendanceCalculator");

function calculateMatchRevenue(team, importance = "normal") {

const attendance = calculateAttendance(team, importance);

const revenue = attendance * team.ticketPrice;

return {
attendance,
revenue
};

}

module.exports = { calculateMatchRevenue };