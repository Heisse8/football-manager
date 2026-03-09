const express = require("express");
const router = express.Router();

const Manager = require("../models/Manager");
const Team = require("../models/Team");

const auth = require("../middleware/auth");

/* ======================================================
GET MY MANAGER
GET /api/manager/my
====================================================== */

router.get("/my", auth, async (req, res) => {

try {

/* ================= TEAM FINDEN ================= */

const team = await Team.findOne({
owner: req.user.userId
}).select("_id name");

if (!team) {
return res.status(404).json({
message: "Kein Team gefunden"
});
}

/* ================= MANAGER LADEN ================= */

const manager = await Manager.findOne({
team: team._id
}).select(
"firstName lastName age rating formation playstyle"
);

if (!manager) {
return res.status(404).json({
message: "Kein Manager gefunden"
});
}

/* ================= RESPONSE ================= */

res.json({
team: {
id: team._id,
name: team.name
},
manager
});

} catch (err) {

console.error("Manager Route Fehler:", err);

res.status(500).json({
message: "Serverfehler Manager"
});

}

});

module.exports = router;