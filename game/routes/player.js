const express = require("express");
const router = express.Router();

const Player = require("../models/Player");
const Team = require("../models/Team");

const auth = require("../middleware/auth");

// =============================
// GET ALL PLAYERS OF MY TEAM
// =============================
router.get("/my-team", auth, async (req, res) => {

try {

/* ================= TEAM LADEN ================= */

const team = await Team.findOne({
owner: req.user.userId
}).select("_id");

if (!team) {
return res.status(404).json({
message: "Team nicht gefunden"
});
}

/* ================= SPIELER LADEN ================= */

const players = await Player.find({
team: team._id
})
.select(
"firstName lastName age nationality positions stars pace shooting passing defending physical mentality marketValue seasonStats"
)
.sort({ stars:-1 })
.lean();

/* ================= RESPONSE ================= */

res.json(players);

} catch (err) {

console.error("Spieler Ladefehler:", err);

res.status(500).json({
message: "Serverfehler"
});

}

});

module.exports = router;