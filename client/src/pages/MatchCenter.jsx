import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MatchCenter() {

const navigate = useNavigate();

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

console.error("Fehler beim Laden der Spiele:",err);
setMatches([]);

}

setLoading(false);

};

loadMatches();

},[]);

/* =====================================================
FORMAT DATE
===================================================== */

function formatDate(date){

if(!date) return "";

const d = new Date(date);

return d.toLocaleDateString("de-DE",{
day:"2-digit",
month:"2-digit"
});

}

/* =====================================================
UI
===================================================== */

return (

<div className="min-h-screen bg-gray-900 text-white p-10">

<h1 className="text-3xl font-bold mb-8">
Aktueller Spieltag
</h1>

{/* LOADING */}

{loading && (
<div className="opacity-60">
Spiele werden geladen...
</div>
)}

{/* EMPTY */}

{!loading && matches.length === 0 && (
<div className="opacity-60">
Noch keine Spiele vorhanden.
</div>
)}

<div className="grid gap-6">

{matches.map(match => {

const played = match.played;

return (

<div
key={match._id}
onClick={() => played && navigate(`/match/${match._id}`)}
className={`p-6 rounded-xl shadow-lg transition border ${
played
? "cursor-pointer hover:bg-white/20 bg-white/10 border-gray-700"
: "opacity-60 bg-white/5 border-gray-800"
}`}
>

{/* DATUM + WETTBEWERB */}

<div className="flex justify-between text-xs text-gray-400 mb-3">

<div>
{match.competition === "cup" ? "🏆 Pokal" : "⚽ Liga"}
</div>

<div>
{formatDate(match.date)}
</div>

</div>

{/* TEAMS */}

<div className="flex justify-between items-center text-lg font-semibold">

<div className="w-1/3 text-right truncate">
{match.homeTeam?.name || "Team"}
</div>

<div className="w-1/3 text-center text-xl font-bold">

{played
? `${match.homeGoals ?? 0} : ${match.awayGoals ?? 0}`
: "vs"}

</div>

<div className="w-1/3 text-left truncate">
{match.awayTeam?.name || "Team"}
</div>

</div>

{/* xG */}

{played && match.xG && (

<div className="mt-3 text-sm text-gray-400 text-center">

xG {match.xG.home ?? 0} - {match.xG.away ?? 0}

</div>

)}

{/* STATUS */}

<div className="mt-3 text-xs text-center text-gray-500">

{played ? "🟢 gespielt" : "⚪ geplant"}

</div>

</div>

);

})}

</div>

</div>

);

}