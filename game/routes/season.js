const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const Match = require("../models/Match");

const {
getNextMatchdayStart,
generateLeagueSchedule
} = require("../utils/seasonScheduler");

/* ======================================================
 START SEASON
 POST /api/season/start
====================================================== */

router.post("/start", async (req, res) => {

try {

/* ================= SAISON CHECK ================= */

const activeSeason = await Match.exists({
competition: "league",
played: false
});

if (activeSeason) {

return res.status(400).json({
error: "Saison läuft bereits"
});

}

/* ================= TEAMS LADEN ================= */

const teams = await Team.find({
league: "bundesliga"
})
.select("_id name")
.lean();

if (teams.length !== 18) {

return res.status(400).json({
error: "Liga nicht vollständig (18 Teams nötig)"
});

}

/* ================= STARTDATUM ================= */

const startDate = getNextMatchdayStart(new Date());

/* ================= SPIELPLAN ================= */

await generateLeagueSchedule(teams, startDate);

/* ================= RESPONSE ================= */

res.json({
success: true,
message: "Saison gestartet",
teams: teams.length,
firstMatchday: startDate
});

} catch (err) {

console.error("Season Start Fehler:", err);

res.status(500).json({
error: "Saisonstart fehlgeschlagen"
});

}

});

module.exports = router;