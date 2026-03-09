import { useEffect, useState } from "react";

/* =====================================================
 SLOT POSITIONEN
===================================================== */

const slotCoordinates = {
GK:{x:50,y:95},

LB:{x:15,y:80}, RB:{x:85,y:80},
LCB:{x:32,y:88}, CCB:{x:50,y:90}, RCB:{x:68,y:88},

LWB:{x:10,y:70}, RWB:{x:90,y:70},

LCDM:{x:40,y:68}, RCDM:{x:60,y:68}, CDM:{x:50,y:68},

LCM:{x:35,y:56}, RCM:{x:65,y:56},

CAM:{x:50,y:45},

LW:{x:18,y:28}, RW:{x:82,y:28},

ST:{x:50,y:16},
LST:{x:38,y:18}, RST:{x:62,y:18}
};

/* =====================================================
 FORMATION ERKENNEN
===================================================== */

function detectFormation(lineup){

const slots = Object.keys(lineup);

const defenders =
slots.filter(s=>["LB","RB","LCB","CCB","RCB"].includes(s)).length;

const midfielders =
slots.filter(s=>["CDM","LCDM","RCDM","LCM","RCM","CAM"].includes(s)).length;

const strikers =
slots.filter(s=>["ST","LST","RST","LW","RW"].includes(s)).length;

return `${defenders}-${midfielders}-${strikers}`;

}

/* =====================================================
 MAIN COMPONENT
===================================================== */

export default function TeamPage(){

const [team,setTeam] = useState(null);
const [players,setPlayers] = useState({});
const [manager,setManager] = useState(null);

const [lineup,setLineup] = useState({});
const [bench,setBench] = useState([]);

const [loading,setLoading] = useState(true);

/* =====================================================
 LOAD DATA
===================================================== */

useEffect(()=>{

const load = async()=>{

try{

const token = localStorage.getItem("token");
if(!token) return;

const headers = {
Authorization:`Bearer ${token}`
};

const [teamRes,playerRes,managerRes,lineupRes] = await Promise.all([
fetch("/api/team",{headers}),
fetch("/api/player/my-team",{headers}),
fetch("/api/manager/my",{headers}),
fetch("/api/team/auto-lineup",{headers})
]);

const teamData = await teamRes.json();
const playerData = await playerRes.json();
const managerData = await managerRes.json();
const lineupData = await lineupRes.json();

/* PLAYER MAP */

const playerMap = {};

playerData.forEach(p=>{
playerMap[p._id] = p;
});

setTeam(teamData);
setPlayers(playerMap);
setManager(managerData);

setLineup(lineupData.lineup || {});
setBench(lineupData.bench || []);

}catch(err){

console.error("TeamPage Fehler:",err);

}

setLoading(false);

};

load();

},[]);

/* =====================================================
 LOADING
===================================================== */

if(loading){
return(
<div className="p-10 text-white">
Lade Team...
</div>
);
}

if(!team || !manager){
return null;
}

/* =====================================================
 FORMATION
===================================================== */

const formation = detectFormation(lineup);

const getPlayerById = (id)=>players[id];

/* =====================================================
 RENDER
===================================================== */

return(

<div className="max-w-[1500px] mx-auto p-6 text-white">

{/* HEADER */}

<div className="flex justify-between mb-8">

<div>

<h2 className="text-2xl font-bold">
{team.name}
</h2>

<p className="text-gray-400">
Trainer: {manager.firstName} {manager.lastName} • {manager.age} Jahre
</p>

</div>

<div className="text-right">

<p className="font-semibold">
Formation
</p>

<p className="text-xl">
{formation}
</p>

<p className="text-sm text-gray-400 mt-1">
Stil: {manager.playStyle}
</p>

</div>

</div>

{/* EMPTY LINEUP */}

{Object.keys(lineup).length === 0 && (

<div className="text-gray-400 mb-8">
Startelf wird automatisch generiert...
</div>

)}

<div className="flex gap-12">

{/* =====================================================
 SPIELFELD
===================================================== */}

<div className="flex flex-col">

<div className="relative w-[720px] h-[960px] bg-green-700 rounded-xl border-4 border-white overflow-hidden">

{/* Mittellinie */}

<div className="absolute top-1/2 left-0 w-full h-[2px] bg-white -translate-y-1/2"></div>

{/* Mittelkreis */}

<div className="absolute top-1/2 left-1/2 w-44 h-44 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>

{/* Strafräume */}

<div className="absolute top-0 left-1/2 w-[320px] h-[150px] border-2 border-white -translate-x-1/2"></div>

<div className="absolute bottom-0 left-1/2 w-[320px] h-[150px] border-2 border-white -translate-x-1/2"></div>

{/* SPIELER */}

{Object.entries(lineup).map(([slot,playerId])=>{

const coords = slotCoordinates[slot];
if(!coords) return null;

const player = getPlayerById(playerId);
if(!player) return null;

return(

<div
key={slot}
style={{
position:"absolute",
left:`${coords.x}%`,
top:`${coords.y}%`,
transform:"translate(-50%,-50%)"
}}
className="flex flex-col items-center"
>

<Circle player={player}/>

<div className="text-xs font-semibold mt-1">
{player.lastName}
</div>

<div className="text-yellow-400 text-xs">
{"★".repeat(Math.round(player.stars || 0))}
</div>

</div>

);

})}

</div>

{/* =====================================================
 BANK
===================================================== */}

<div className="mt-6 bg-black/40 p-4 rounded-xl w-[720px]">

<h3 className="mb-3 font-semibold">
Auswechselbank
</h3>

<div className="flex justify-between">

{bench.map(id=>{

const player = getPlayerById(id);
if(!player) return null;

return(

<div key={id} className="flex flex-col items-center w-[90px]">

<Circle player={player}/>

<div className="text-xs mt-1 text-center">
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

{/* =====================================================
 SPIELERLISTE
===================================================== */}

<div className="w-[420px] bg-black/40 p-6 rounded-xl">

<h3 className="font-semibold mb-4">
Startelf
</h3>

{Object.values(lineup).map(id=>{

const p = getPlayerById(id);
if(!p) return null;

return <PlayerCard key={p._id} player={p}/>;

})}

<h3 className="mt-6 font-semibold">
Auswechselbank
</h3>

{bench.map(id=>{

const p = getPlayerById(id);
if(!p) return null;

return <PlayerCard key={p._id} player={p}/>;

})}

</div>

</div>

</div>

);

}

/* =====================================================
 PLAYER CARD
===================================================== */

function PlayerCard({player}){

return(

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

/* =====================================================
 PLAYER CIRCLE
===================================================== */

function Circle({player}){

return(

<div className="w-14 h-14 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-xs font-semibold">
{player.positions?.[0] || ""}
</div>

);

}