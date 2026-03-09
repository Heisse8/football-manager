import { useEffect, useState } from "react";

export default function TopscorerWidget(){

const [players,setPlayers] = useState([]);
const [loading,setLoading] = useState(true);

/* =====================================================
LOAD TOPSCORERS
===================================================== */

useEffect(()=>{

const loadTopscorers = async ()=>{

try{

const res = await fetch("/api/league/topscorers");

if(!res.ok){
setPlayers([]);
setLoading(false);
return;
}

const data = await res.json();

setPlayers(Array.isArray(data) ? data.slice(0,6) : []);

}catch(err){

console.error("TopscorerWidget Fehler:",err);
setPlayers([]);

}

setLoading(false);

};

loadTopscorers();

},[]);

/* =====================================================
UI
===================================================== */

return(

<div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/40">

<h3 className="font-bold mb-4 text-gray-800">
Torjäger
</h3>

{/* LOADING */}

{loading && (
<p className="text-sm text-gray-500">
Torjäger werden geladen...
</p>
)}

{/* EMPTY */}

{!loading && players.length === 0 && (
<p className="text-sm text-gray-500">
Noch keine Tore
</p>
)}

{/* LIST */}

{players.map((p,index)=>{

return(

<div
key={p._id || index}
className="flex justify-between py-2 border-b text-sm"
>

<span className="truncate">
{index + 1}. {p.name || `${p.firstName || ""} ${p.lastName || ""}`}
</span>

<span className="font-bold text-blue-600">
{p.goals ?? 0}
</span>

</div>

);

})}

</div>

);

}