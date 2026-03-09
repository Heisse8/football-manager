import { useEffect, useState } from "react";

export default function MatchdayWidget(){

const [matches,setMatches] = useState([]);
const [loading,setLoading] = useState(true);

/* =====================================================
LOAD MATCHES
===================================================== */

useEffect(()=>{

const loadMatches = async ()=>{

try{

const res = await fetch("/api/match/current");

if(!res.ok){
setMatches([]);
setLoading(false);
return;
}

const data = await res.json();

setMatches(Array.isArray(data) ? data : []);

}catch(err){

console.error("MatchdayWidget Fehler:",err);
setMatches([]);

}

setLoading(false);

};

loadMatches();

},[]);

/* =====================================================
UI
===================================================== */

return(

<div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/40">

<h3 className="font-bold mb-4 text-gray-800">
Begegnungen
</h3>

{/* LOADING */}

{loading && (
<p className="text-sm text-gray-500">
Spiele werden geladen...
</p>
)}

{/* EMPTY */}

{!loading && matches.length === 0 && (
<p className="text-sm text-gray-500">
Keine Spiele vorhanden
</p>
)}

{/* MATCH LIST */}

{matches.map(match => (

<div
key={match._id}
className="flex justify-between py-2 border-b text-sm"
>

<span className="truncate">
{match.homeTeam?.name || match.homeTeam}
</span>

<span className="font-bold">
{match.homeGoals ?? "-"} : {match.awayGoals ?? "-"}
</span>

<span className="truncate">
{match.awayTeam?.name || match.awayTeam}
</span>

</div>

))}

</div>

);

}