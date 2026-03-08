const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const Stadium = require("../models/Stadium");
const Player = require("../models/Player");
const Manager = require("../models/Manager");

const auth = require("../middleware/auth");

const { generatePlayersForTeam } = require("../utils/playerGenerator");
const { getNextLeague } = require("../utils/leagueManager");
const { generateLeagueSchedule } = require("../utils/scheduleGenerator");
const { createBotTeam } = require("../utils/botGenerator");
const { replaceBotTeam } = require("../utils/replaceBotTeam");

/* =====================================================
 FORMATIONEN
===================================================== */

const formations = {

"4-3-3": ["GK","LB","LCB","RCB","RB","CDM","LCM","RCM","LW","ST","RW"],

"4-4-2": ["GK","LB","LCB","RCB","RB","LCM","RCM","LW","RW","LST","RST"],

"4-2-3-1": ["GK","LB","LCB","RCB","RB","LCDM","RCDM","LW","CAM","RW","ST"],

"3-5-2": ["GK","LCB","CCB","RCB","LWB","RWB","CDM","LCM","RCM","LST","RST"]

};

/* =====================================================
 POSITION MATCH
===================================================== */

function positionMatches(playerPositions, slot) {

if (!playerPositions) return false;

if (playerPositions.includes(slot)) return true;

const cleanSlot = slot.replace("L","").replace("R","");

return playerPositions.some(pos => {

const cleanPos = pos.replace("L","").replace("R","");

return cleanPos === cleanSlot;

});

}

/* =====================================================
 TRAINER KI LINEUP
===================================================== */

function generateSmartLineup(players, formation) {

const lineup = {};
const bench = [];
const used = new Set();

const slots = formations[formation] || formations["4-3-3"];

const sortedPlayers = [...players].sort(
(a,b) => b.stars - a.stars
);

function isDefender(slot) {
return ["LCB","CCB","RCB","LB","RB","LWB","RWB"].includes(slot);
}

function isMidfielder(slot) {
return ["CDM","LCDM","RCDM","LCM","RCM","CAM"].includes(slot);
}

function isStriker(slot) {
return ["ST","LST","RST","LW","RW"].includes(slot);
}

for (const slot of slots) {

let player = sortedPlayers.find(p =>
!used.has(p._id.toString()) &&
positionMatches(p.positions, slot)
);

if (!player) {

player = sortedPlayers.find(p => {

if (used.has(p._id.toString())) return false;

const pos = p.positions || [];

if (isDefender(slot))
return pos.some(position =>
["CB","LCB","RCB","LB","RB","LWB","RWB"].includes(position)
);

if (isMidfielder(slot))
return pos.some(position =>
["CDM","CM","LCM","RCM","CAM"].includes(position)
);

if (isStriker(slot))
return pos.some(position =>
["ST","LST","RST","LW","RW"].includes(position)
);

return false;

});

}

if (player) {

lineup[slot] = player._id;
used.add(player._id.toString());

}

}

/* ================= BANK ================= */

for (const player of sortedPlayers) {

if (!used.has(player._id.toString()) && bench.length < 7) {

bench.push(player._id);
used.add(player._id.toString());

}

}

return { lineup, bench };

}

/* =====================================================
 CREATE TEAM
===================================================== */

router.post("/create", auth, async (req,res) => {

try {

const userId = req.user.userId;

let { name, shortName, clubIdentity } = req.body;

/* ================= VALIDATION ================= */

if (!name || !shortName) {

return res.status(400).json({
message:"Name und Kürzel erforderlich."
});

}

if (!clubIdentity || !["love","commercial"].includes(clubIdentity)) {

return res.status(400).json({
message:"Ungültiges Vereinsimage."
});

}

name = name.trim();
shortName = shortName.trim().toUpperCase();

if (!/^[A-Z]{3}$/.test(shortName)) {

return res.status(400).json({
message:"Kürzel muss genau 3 Großbuchstaben haben."
});

}

if (await Team.findOne({ owner:userId })) {

return res.status(400).json({
message:"Du hast bereits ein Team."
});

}

if (await Team.findOne({ name })) {

return res.status(400).json({
message:"Teamname bereits vergeben."
});

}

if (await Team.findOne({ shortName })) {

return res.status(400).json({
message:"Kürzel bereits vergeben."
});

}

/* ================= CLUB IDENTITY EFFECT ================= */

let balance;
let stadiumCapacity;
let homeBonus;
let fanBase;

if (clubIdentity === "love") {

balance = 4000000;
stadiumCapacity = 12000;
homeBonus = 1.15;
fanBase = 1.2;

} else {

balance = 7000000;
stadiumCapacity = 8000;
homeBonus = 1.05;
fanBase = 0.9;

}

/* ================= LIGA ================= */

const league = await getNextLeague();

/* ================= TEAM ================= */

const newTeam = new Team({

name,
shortName,
owner:userId,

clubIdentity,

country:"Deutschland",

league,

balance,

fanBase,
homeBonus,

currentMatchday:1

});

await newTeam.save();

/* Bot Team ersetzen */
await replaceBotTeam(newTeam);

/* ================= SPIELER ================= */

await generatePlayersForTeam(newTeam);

/* ================= MANAGER ================= */

const firstNames = ["Thomas","Michael","Stefan","Lukas","Daniel"];
const lastNames = ["Schmidt","Müller","Wagner","Becker","Hoffmann"];
const playstyles = ["Ballbesitz","Kontern","Gegenpressing","Mauern"];

const formationKeys = Object.keys(formations);

await Manager.create({

team:newTeam._id,

firstName:firstNames[Math.floor(Math.random()*firstNames.length)],

lastName:lastNames[Math.floor(Math.random()*lastNames.length)],

age:40 + Math.floor(Math.random()*15),

rating:2,

formation:formationKeys[Math.floor(Math.random()*formationKeys.length)],

playstyle:playstyles[Math.floor(Math.random()*playstyles.length)]

});

/* ================= STADION ================= */

await Stadium.create({

team:newTeam._id,

capacity:stadiumCapacity,

ticketPrice:15,

fanComfort:1,
atmosphere:1

});

/* ================= LIGA FÜLLEN ================= */

let teamsInLeague = await Team.find({ league });

if (teamsInLeague.length >= 6 && teamsInLeague.length < 18) {

while (teamsInLeague.length < 18) {

const bot = await createBotTeam(league);

teamsInLeague.push(bot);

}

}

/* ================= SPIELPLAN ================= */

teamsInLeague = await Team.find({ league });

if (teamsInLeague.length === 18) {

const existingMatches = await require("../models/Match").findOne({ league });

if (!existingMatches) {

await generateLeagueSchedule(teamsInLeague, league);

}

}

/* ================= RESPONSE ================= */

res.status(201).json({

message:"Team erfolgreich erstellt.",
team:newTeam

});

} catch(err) {

console.error("Create Team Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
 GET MY TEAM
===================================================== */

router.get("/", auth, async (req,res) => {

try {

const team = await Team.findOne({
owner:req.user.userId
});

if (!team) {

return res.status(404).json({
message:"Kein Team gefunden"
});

}

res.json(team);

} catch(err) {

console.error("Get Team Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

/* =====================================================
 AUTO LINEUP
===================================================== */

router.get("/auto-lineup", auth, async (req,res) => {

try {

const team = await Team.findOne({
owner:req.user.userId
});

if (!team) return res.status(404).json({ message:"Kein Team" });

const manager = await Manager.findOne({
team:team._id
});

const players = await Player.find({
team:team._id
});

if (!manager) return res.status(404).json({ message:"Kein Manager" });

const { lineup, bench } = generateSmartLineup(
players,
manager.formation
);

res.json({ lineup, bench });

} catch(err) {

console.error("Auto Lineup Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

module.exports = router;