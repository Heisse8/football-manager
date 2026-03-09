import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Spieltag(){

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

console.error("Spieltag Fehler:",err);
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

<div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 border border-white/40">

<h2 className="text-2xl font-bold mb-8 text-gray-800">
Aktueller Spieltag
</h2>

{loading && (
<p className="text-gray-500 text-sm">
Spiele werden geladen...
</p>
)}

{!loading && matches.length === 0 && (
<p className="text-gray-500 text-sm">
Keine Spiele vorhanden.
</p>
)}

<div className="space-y-4">

{matches.map(match => (

<Link
to={`/match/${match._id}`}
key={match._id}
className="flex justify-between items-center bg-white/80 rounded-lg px-6 py-4 shadow-md hover:shadow-lg transition"
>

<span className="font-medium">
{match.homeTeam?.name || match.homeTeam}
</span>

<span className="text-lg font-bold">
{match.homeGoals ?? "-"} : {match.awayGoals ?? "-"}
</span>

<span className="font-medium">
{match.awayTeam?.name || match.awayTeam}
</span>

</Link>

))}

</div>

</div>

);

}