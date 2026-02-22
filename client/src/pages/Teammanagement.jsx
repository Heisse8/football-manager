import { useState, useEffect } from "react";

export default function Teammanagement() {

/* ================= POSITIONSSLOTS ================= */

const positionSlots = [
 { id: 1, role: "TW", x: 50, y: 92 },
 { id: 2, role: "LV", x: 10, y: 80 },
 { id: 3, role: "IV", x: 35, y: 85 },
 { id: 4, role: "IV", x: 50, y: 87 },
 { id: 5, role: "IV", x: 65, y: 85 },
 { id: 6, role: "RV", x: 90, y: 80 },
 { id: 7, role: "LWB", x: 5, y: 65 },
 { id: 8, role: "RWB", x: 95, y: 65 },
 { id: 9, role: "ZDM", x: 35, y: 68 },
 { id: 10, role: "ZDM", x: 50, y: 65 },
 { id: 11, role: "ZDM", x: 65, y: 68 },
 { id: 12, role: "ZM", x: 35, y: 52 },
 { id: 13, role: "ZM", x: 50, y: 50 },
 { id: 14, role: "ZM", x: 65, y: 52 },
 { id: 15, role: "ZOM", x: 35, y: 38 },
 { id: 16, role: "ZOM", x: 50, y: 35 },
 { id: 17, role: "ZOM", x: 65, y: 38 },
 { id: 18, role: "LW", x: 20, y: 22 },
 { id: 19, role: "RW", x: 80, y: 22 },
 { id: 20, role: "ST", x: 35, y: 15 },
 { id: 21, role: "ST", x: 50, y: 12 },
 { id: 22, role: "ST", x: 65, y: 15 },
];

const roleOptions = {
TW: ["Shotstopper", "Mitspielender Torwart"],
IV: ["Innenverteidiger", "Ballspielender IV"],
LV: ["Außenverteidiger"],
RV: ["Außenverteidiger"],
LWB: ["Wingback"],
RWB: ["Wingback"],
ZDM: ["Abräumer"],
ZM: ["Box-to-Box", "Spielmacher"],
ZOM: ["Schattenstürmer"],
LW: ["Inverser Flügel"],
RW: ["Inverser Flügel"],
ST: ["Zielspieler","Falsche 9"]
};

/* ================= STATE ================= */

const [positions, setPositions] = useState({});
const [bench, setBench] = useState({});
const [activePlayer, setActivePlayer] = useState(null);
const [playerRoles, setPlayerRoles] = useState({});
const [squad, setSquad] = useState([]);

const [teamSettings, setTeamSettings] = useState({
style: "Ballbesitz",
passing: "Variabel",
pressing: "Mittelfeldpressing",
defenseLine: "Mittel",
mentality: "Ausgewogen",
tempo: "Normal"
});

/* ================= UI SAVE ================= */

useEffect(() => {
const saved = localStorage.getItem("teamData");
if (saved) {
const data = JSON.parse(saved);
setPositions(data.positions || {});
setBench(data.bench || {});
setPlayerRoles(data.playerRoles || {});
setTeamSettings(data.teamSettings || teamSettings);
 }
}, []);

useEffect(() => {
localStorage.setItem(
"teamData",
JSON.stringify({ positions, bench, playerRoles, teamSettings })
 );
}, [positions, bench, playerRoles, teamSettings]);

/* ================= SPIELER LADEN ================= */

useEffect(() => {
const clubId = localStorage.getItem("clubId");
if (!clubId) return;

fetch(`/api/clubs/${clubId}`)
 .then(res => res.json())
 .then(data => {
if (!data.players) return;
const formatted = data.players.map((p, index) => ({
id: p._id,
name: p.name,
number: index + 1,
rating: p.overall / 20,
stamina: p.stamina,
positions: p.positions || [p.position]
 }));
setSquad(formatted);
 });
}, []);

/* ================= REST BLEIBT UNVERÄNDERT ================= */
return (
  <div className="min-h-screen bg-gray-900 text-white p-10">
    Teammanagement lädt...
  </div>
);
}