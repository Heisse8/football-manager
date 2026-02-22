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

/* ================= ROLLEN ================= */

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

 fetch(`https://football-manager-z7rr.onrender.com/api/clubs/${clubId}`)
   .then(res => res.json())
   .then(data => {
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

/* ================= LOGIK ================= */

const getPlayer = (id) =>
 squad.find(p => p.id === id);

const removeEverywhere = (id) => {
 setPositions(prev => {
   const copy = { ...prev };
   Object.keys(copy).forEach(k => {
     if (copy[k]?.id === id) delete copy[k];
   });
   return copy;
 });
 setBench(prev => {
   const copy = { ...prev };
   Object.keys(copy).forEach(k => {
     if (copy[k]?.id === id) delete copy[k];
   });
   return copy;
 });
};

const handleDragStart = (e, player) => {
 e.dataTransfer.setData("text/plain", player.id);
 setActivePlayer(player);
};

const handleDropOnField = (e, slot) => {
 e.preventDefault();
 const player = getPlayer(e.dataTransfer.getData("text/plain"));
 if (!player || !player.positions.includes(slot.role)) return;
 removeEverywhere(player.id);
 setPositions(prev => ({ ...prev, [slot.id]: player }));
 setActivePlayer(null);
};

const handleDropOnBench = (e, index) => {
 e.preventDefault();
 const player = getPlayer(e.dataTransfer.getData("text/plain"));
 if (!player) return;
 removeEverywhere(player.id);
 setBench(prev => ({ ...prev, [index]: player }));
 setActivePlayer(null);
};

const start11 = Object.values(positions);
const benchPlayers = Object.values(bench);
const notInSquad = squad.filter(
 p =>
 !start11.some(s => s.id === p.id) &&
 !benchPlayers.some(b => b.id === p.id)
);

/* ================= HELPER ================= */

function renderStars(rating) {
 const full = Math.floor(rating);
 const half = rating % 1 >= 0.5;
 const empty = 5 - full - (half ? 1 : 0);

 return (
   <div className="flex text-yellow-400 text-sm">
     {[...Array(full)].map((_,i)=><span key={i}>★</span>)}
     {half && <span>☆</span>}
     {[...Array(empty)].map((_,i)=><span key={"e"+i} className="text-gray-500">★</span>)}
   </div>
 );
}

function renderPlayer(player) {
 return (
   <div
     key={player.id}
     draggable
     onDragStart={(e)=>handleDragStart(e,player)}
     onClick={()=>setActivePlayer(player)}
     className="p-3 mb-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
   >
     <div className="flex justify-between">
       <div>
         <div className="font-semibold">
           {player.number} – {player.name}
         </div>
         <div className="text-xs text-gray-300">
           {player.positions.join(" | ")}
         </div>
         <div className="text-xs text-green-400">
           Fitness: {player.stamina}%
         </div>
       </div>
       {renderStars(player.rating)}
     </div>
   </div>
 );
}

/* ================= RENDER ================= */

return (
<div className="min-h-screen bg-gray-900 text-white p-10">
<div className="grid grid-cols-3 gap-8 max-w-[1700px] mx-auto">

{/* LINKS */}
<div className="col-span-2 flex flex-col gap-6">

{/* SPIELEINSTELLUNGEN */}
<div className="bg-black/40 rounded-xl p-6">
<h3 className="font-bold mb-4 text-lg">Spieleinstellungen</h3>
<div className="grid grid-cols-3 gap-4">
{Object.keys(teamSettings).map(key=>(
<select
 key={key}
 value={teamSettings[key]}
 onChange={(e)=>setTeamSettings({...teamSettings,[key]:e.target.value})}
 className="bg-gray-800 p-2 rounded"
>
<option>{teamSettings[key]}</option>
</select>
))}
</div>
</div>

{/* SPIELFELD */}
<div className="relative bg-green-700 rounded-2xl h-[750px]">

{/* Linien */}
<div className="absolute inset-[4%] border-4 border-white"></div>
<div className="absolute left-[4%] right-[4%] top-1/2 h-[3px] bg-white"></div>
<div className="absolute w-[18%] h-[18%] border-4 border-white rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>

{/* Strafräume + 5m Räume */}
<div className="absolute left-1/2 top-[4%] w-[50%] h-[18%] border-4 border-white -translate-x-1/2"></div>
<div className="absolute left-1/2 top-[4%] w-[25%] h-[8%] border-4 border-white -translate-x-1/2"></div>
<div className="absolute left-1/2 bottom-[4%] w-[50%] h-[18%] border-4 border-white -translate-x-1/2"></div>
<div className="absolute left-1/2 bottom-[4%] w-[25%] h-[8%] border-4 border-white -translate-x-1/2"></div>

{/* Gesetzte Spieler */}
{Object.entries(positions).map(([slotId, player]) => {
const slot = positionSlots.find(s => s.id === Number(slotId));
return (
<div
key={slotId}
draggable
onDragStart={(e)=>handleDragStart(e,player)}
onClick={()=>setActivePlayer(player)}
className="absolute w-20 h-20 bg-green-600 rounded-full flex flex-col items-center justify-center border-2 border-white z-20 text-xs"
style={{ left:`${slot.x}%`, top:`${slot.y}%`, transform:"translate(-50%,-50%)" }}
>
<div>{player.number}</div>
{playerRoles[slotId] && (
<div className="text-[9px] bg-black/70 px-2 rounded-full">
{playerRoles[slotId]}
</div>
)}
</div>
);
})}

{/* Positionsvorschläge */}
{activePlayer &&
positionSlots
.filter(slot => activePlayer.positions.includes(slot.role))
.map(slot => (
<div
key={slot.id}
onClick={()=>{
removeEverywhere(activePlayer.id);
setPositions(prev=>({...prev,[slot.id]:activePlayer}));
setActivePlayer(null);
}}
onDragOver={(e)=>e.preventDefault()}
onDrop={(e)=>handleDropOnField(e,slot)}
className="absolute w-16 h-16 bg-white/80 text-black rounded-full flex items-center justify-center text-xs cursor-pointer z-30"
style={{ left:`${slot.x}%`, top:`${slot.y}%`, transform:"translate(-50%,-50%)" }}
>
{slot.role}
</div>
))
}

</div>

{/* Rollenpanel */}
{activePlayer && (() => {
const slotId = Object.keys(positions).find(
key => positions[key]?.id === activePlayer.id
);
const slot = positionSlots.find(s => s.id === Number(slotId));
if (!slot || !roleOptions[slot.role]) return null;

return (
<div className="bg-black/40 rounded-xl p-6">
<h3 className="font-bold mb-3">
Rolle für {activePlayer.name}
</h3>
<div className="flex flex-wrap gap-2">
{roleOptions[slot.role].map(role => (
<button
key={role}
onClick={() =>
setPlayerRoles(prev => ({
...prev,
[slotId]: role
}))
}
className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
>
{role}
</button>
))}
</div>
</div>
);
})()}

{/* BANK */}
<div className="bg-black/40 rounded-xl p-6">
<h3 className="font-bold mb-4">Auswechselbank</h3>
<div className="grid grid-cols-9 gap-3">
{Array.from({ length: 9 }).map((_, i) => (
<div
key={i}
onDragOver={(e)=>e.preventDefault()}
onDrop={(e)=>handleDropOnBench(e,i)}
className="h-20 bg-gray-700 rounded flex items-center justify-center"
>
{bench[i] ? bench[i].name : "+"}
</div>
))}
</div>
</div>

</div>

{/* RECHTS */}
<div className="bg-black/40 rounded-xl p-6">
<h3 className="font-bold mb-4">Start11</h3>
{start11.map(renderPlayer)}

<h3 className="font-bold mt-6 mb-4">Auswechsel</h3>
{benchPlayers.map(renderPlayer)}

<h3 className="font-bold mt-6 mb-4">Nicht im Kader</h3>
{notInSquad.map(renderPlayer)}
</div>

</div>
</div>
);
}