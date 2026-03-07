import { useEffect, useState } from "react";

/* =====================================================
 SLOT POSITIONEN
===================================================== */

const slotCoordinates = {
GK:{x:50,y:96},

LB:{x:12,y:82}, RB:{x:88,y:82},
LCB:{x:30,y:90}, CCB:{x:50,y:92}, RCB:{x:70,y:90},

LWB:{x:10,y:72}, RWB:{x:90,y:72},

LCDM:{x:40,y:70}, RCDM:{x:60,y:70}, CDM:{x:50,y:70},

LCM:{x:35,y:58}, RCM:{x:65,y:58},

CAM:{x:50,y:48},

LW:{x:18,y:28}, RW:{x:82,y:28},

ST:{x:50,y:16},
LST:{x:38,y:18}, RST:{x:62,y:18}
};

export default function TeamPage() {

const [team, setTeam] = useState(null);
const [players, setPlayers] = useState([]);
const [manager, setManager] = useState(null);
const [lineup, setLineup] = useState({});
const [bench, setBench] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {

const load = async () => {

const token = localStorage.getItem("token");
if (!token) return;

const headers = { Authorization: `Bearer ${token}` };

try {

const teamRes = await fetch("/api/team", { headers });
const playerRes = await fetch("/api/player/my-team", { headers });
const managerRes = await fetch("/api/manager/my", { headers });
const lineupRes = await fetch("/api/team/auto-lineup", { headers });

const teamData = await teamRes.json();
const playerData = await playerRes.json();
const managerData = await managerRes.json();
const lineupData = await lineupRes.json();

setTeam(teamData);
setPlayers(playerData);
setManager(managerData);

setLineup(lineupData.lineup || {});
setBench(lineupData.bench || []);

setLoading(false);

 } catch (err) {
console.error("TeamPage Fehler:", err);
setLoading(false);
 }
 };

load();

 }, []);

if (loading) return <div className="p-10 text-white">Lade Team...</div>;
if (!team || !manager) return null;

const getPlayerById = (id) =>
players.find(p => p._id.toString() === id.toString());

return (
<div className="max-w-[1500px] mx-auto p-6 text-white">

{/* HEADER */}
<div className="flex justify-between mb-8">
<div>
<h2 className="text-2xl font-bold">{team.name}</h2>
<p className="text-gray-400">
 Trainer: {manager.firstName} {manager.lastName} • {manager.age} Jahre
</p>
</div>

<div className="text-right">
<p className="font-semibold">Formation</p>
<p className="text-xl">{manager.formation}</p>
<p className="text-sm text-gray-400 mt-1">
 Stil: {manager.playstyle}
</p>
</div>
</div>

<div className="flex gap-12">

{/* SPIELFELD */}
<div className="flex flex-col">

<div className="relative w-[750px] h-[950px] bg-green-700 rounded-xl border-4 border-white overflow-hidden">

{/* MITTELLINIE */}
<div className="absolute top-1/2 left-0 w-full h-[2px] bg-white -translate-y-1/2"></div>

{/* MITTELKREIS */}
<div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>

{/* ===== OBERER STRAFRAUM ===== */}
<div className="absolute top-0 left-1/2 w-[320px] h-[150px] border-2 border-white -translate-x-1/2"></div>

{/* 5M RAUM OBEN */}
<div className="absolute top-0 left-1/2 w-[160px] h-[70px] border-2 border-white -translate-x-1/2"></div>

{/* TOR OBEN */}
<div className="absolute top-0 left-1/2 w-[100px] h-[12px] border-2 border-white -translate-x-1/2"></div>

{/* ===== UNTERER STRAFRAUM ===== */}
<div className="absolute bottom-0 left-1/2 w-[320px] h-[150px] border-2 border-white -translate-x-1/2"></div>

{/* 5M RAUM UNTEN */}
<div className="absolute bottom-0 left-1/2 w-[160px] h-[70px] border-2 border-white -translate-x-1/2"></div>

{/* TOR UNTEN */}
<div className="absolute bottom-0 left-1/2 w-[100px] h-[12px] border-2 border-white -translate-x-1/2"></div>

{/* SPIELER */}
{Object.entries(lineup).map(([slot, playerId]) => {

const coords = slotCoordinates[slot];
if (!coords) return null;

const player = getPlayerById(playerId);
if (!player) return null;

return (
<div
key={slot}
style={{
position: "absolute",
left: `${coords.x}%`,
top: `${coords.y}%`,
transform: "translate(-50%,-50%)"
}}
className="flex flex-col items-center text-center"
>
<Circle player={player} />

<div className="text-xs mt-1 font-semibold">
{player.lastName}
</div>

<div className="text-yellow-400 text-xs">
{"★".repeat(Math.round(player.stars || 0))}
</div>

</div>
);
})}

</div>

{/* BANK */}
<div className="mt-6 bg-black/40 p-4 rounded-xl w-[750px]">

<h3 className="mb-3 font-semibold">Auswechselbank</h3>

<div className="grid grid-cols-7 gap-4">

{bench.map(id => {

const player = getPlayerById(id);
if (!player) return null;

return (
<div key={id} className="flex flex-col items-center">

<Circle player={player} />

<div className="text-xs mt-1">
{player.lastName}
</div>

<div className="text-yellow-400 text-xs">
{"★".repeat(Math.round(player.stars || 0))}
</div>

</div>
);
})}

</div>

</div>

</div>

{/* RECHTE LISTE */}
<div className="w-[420px] bg-black/40 p-6 rounded-xl">

<h3 className="font-semibold mb-4">Startelf</h3>

{Object.values(lineup).map(id => {
const p = getPlayerById(id);
if (!p) return null;
return <PlayerCard key={p._id} player={p} />;
})}

<h3 className="mt-6 font-semibold">Auswechselbank</h3>

{bench.map(id => {
const p = getPlayerById(id);
if (!p) return null;
return <PlayerCard key={p._id} player={p} />;
})}

</div>

</div>
</div>
);
}

/* =====================================================
 COMPONENTS
===================================================== */

function PlayerCard({ player }) {
return (
<div className="bg-gray-900 p-3 rounded mb-2">
<div className="font-semibold">
{player.firstName} {player.lastName}
</div>
<div className="text-xs text-gray-400">
{player.age} Jahre • {player.positions?.join(", ")}
</div>
<div className="text-yellow-400 text-xs">
{"★".repeat(Math.round(player.stars || 0))}
</div>
</div>
);
}

function Circle({ player }) {
return (
<div className="w-14 h-14 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-xs">
{player.positions?.[0] || ""}
</div>
);
}