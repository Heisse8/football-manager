import { useEffect, useState } from "react";

export default function Tabelle(){

const [table,setTable] = useState([]);
const [loading,setLoading] = useState(true);

/* =====================================================
LOAD TABLE
===================================================== */

useEffect(()=>{

const loadTable = async()=>{

try{

const res = await fetch("/api/league/table");

if(!res.ok){
setTable([]);
setLoading(false);
return;
}

const data = await res.json();

setTable(Array.isArray(data) ? data : []);

}catch(err){

console.error("Tabelle Fehler:",err);
setTable([]);

}

setLoading(false);

};

loadTable();

},[]);

/* =====================================================
MOVEMENT
===================================================== */

const getMovement = (team)=>{

if(!team.previousPosition) return "➖";

if(team.position < team.previousPosition) return "🟢🔺";

if(team.position > team.previousPosition) return "🔴🔻";

return "➖";

};

/* =====================================================
UI
===================================================== */

return(

<div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 border border-white/40">

<h2 className="text-2xl font-bold mb-8 text-gray-800">
Liga Tabelle
</h2>

{/* LOADING */}

{loading && (
<p className="text-sm text-gray-500">
Tabelle wird geladen...
</p>
)}

{/* TABLE */}

{!loading && table.length > 0 && (

<table className="w-full text-sm">

<thead className="border-b text-gray-600 uppercase text-xs tracking-wide">

<tr>
<th className="py-3 text-left w-12">#</th>
<th className="w-10"></th>
<th className="text-left">Team</th>
<th className="text-center w-12">Sp</th>
<th className="text-center w-12">S</th>
<th className="text-center w-12">U</th>
<th className="text-center w-12">N</th>
<th className="text-center w-20">Tore</th>
<th className="text-center w-16">Diff</th>
<th className="text-center w-16 font-bold">Pkt</th>
</tr>

</thead>

<tbody className="tabular-nums">

{table.map((team)=>{

const diff = (team.goalsFor || 0) - (team.goalsAgainst || 0);

return(

<tr
key={team._id || team.name}
className="border-b hover:bg-gray-100/60 transition align-middle"
>

{/* POSITION */}

<td className="py-4 font-bold">
{team.position}.
</td>

{/* MOVEMENT */}

<td>
{getMovement(team)}
</td>

{/* TEAM */}

<td className="py-4">

<div className="flex items-center gap-3">

<div className="w-6 h-6 bg-gray-300 rounded-full"></div>

<span className="font-medium leading-none translate-y-[1px]">
{team.name}
</span>

</div>

</td>

{/* STATS */}

<td className="text-center py-4">{team.games || 0}</td>
<td className="text-center py-4">{team.wins || 0}</td>
<td className="text-center py-4">{team.draws || 0}</td>
<td className="text-center py-4">{team.losses || 0}</td>

<td className="text-center py-4">
{team.goalsFor || 0}:{team.goalsAgainst || 0}
</td>

<td className="text-center py-4">
{diff > 0 ? `+${diff}` : diff}
</td>

<td className="text-center py-4 font-bold text-gray-900">
{team.points || 0}
</td>

</tr>

);

})}

</tbody>

</table>

)}

{/* EMPTY */}

{!loading && table.length === 0 && (
<p className="text-sm text-gray-500 mt-4">
Noch keine Daten vorhanden.
</p>
)}

</div>

);

}