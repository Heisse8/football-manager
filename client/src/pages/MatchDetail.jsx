import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MatchDetail(){

const { id } = useParams();

const [match,setMatch] = useState(null);
const [loading,setLoading] = useState(true);

/* =====================================================
LOAD MATCH
===================================================== */

useEffect(()=>{

const loadMatch = async()=>{

try{

const res = await fetch(`/api/match/${id}`);

if(!res.ok){
setMatch(null);
setLoading(false);
return;
}

const data = await res.json();

setMatch(data);

}catch(err){

console.error("Match laden Fehler:",err);
setMatch(null);

}

setLoading(false);

};

loadMatch();

},[id]);

/* =====================================================
LOADING
===================================================== */

if(loading){

return(
<div className="p-10 text-white bg-gray-900 min-h-screen">
Spiel wird geladen...
</div>
);

}

/* =====================================================
NOT FOUND
===================================================== */

if(!match){

return(
<div className="p-10 text-white bg-gray-900 min-h-screen">
Spiel nicht gefunden
</div>
);

}

/* =====================================================
DATA
===================================================== */

const stats = match.stats || {};
const events = Array.isArray(match.events) ? match.events : [];

/* =====================================================
UI
===================================================== */

return(

<div className="min-h-screen bg-gray-900 text-white p-10 max-w-[1100px] mx-auto">

{/* HEADER */}

<div className="text-center mb-10">

<h1 className="text-3xl font-bold mb-2">

{match.homeTeam?.name || "Home"}

<span className="mx-4 text-yellow-400 text-4xl font-bold">

{match.homeGoals ?? 0} : {match.awayGoals ?? 0}

</span>

{match.awayTeam?.name || "Away"}

</h1>

<div className="text-gray-400">

xG {match.xG?.home ?? 0} : {match.xG?.away ?? 0}

</div>

</div>

{/* =====================================================
STATS
===================================================== */}

<div className="grid grid-cols-3 gap-8 mb-10 text-sm">

<div className="text-right space-y-2">
<div>Shots</div>
<div>Dribbles</div>
<div>Crosses</div>
<div>Long Shots</div>
<div>Blocks</div>
</div>

<div className="text-center font-bold text-yellow-400 space-y-2">

<div>{stats.shots?.home ?? 0} - {stats.shots?.away ?? 0}</div>
<div>{stats.dribbles?.home ?? 0} - {stats.dribbles?.away ?? 0}</div>
<div>{stats.crosses?.home ?? 0} - {stats.crosses?.away ?? 0}</div>
<div>{stats.longShots?.home ?? 0} - {stats.longShots?.away ?? 0}</div>
<div>{stats.blocks?.home ?? 0} - {stats.blocks?.away ?? 0}</div>

</div>

<div className="text-left space-y-2">
<div>Shots</div>
<div>Dribbles</div>
<div>Crosses</div>
<div>Long Shots</div>
<div>Blocks</div>
</div>

</div>

{/* =====================================================
TIMELINE
===================================================== */}

<div className="bg-gray-800 rounded-xl p-6">

<h2 className="text-xl font-bold mb-4">
Match Events
</h2>

{events.length === 0 && (
<div className="text-gray-400">
Keine Events vorhanden
</div>
)}

<div className="space-y-2">

{events.map((event,index)=>{

let icon="";

if(event.type === "goal") icon="⚽";
if(event.type === "save") icon="🧤";
if(event.type === "yellow_card") icon="🟨";
if(event.type === "red_card") icon="🟥";
if(event.type === "injury") icon="🚑";

return(

<div
key={index}
className="flex items-center gap-3 border-b border-gray-700 py-2"
>

<div className="w-10 text-gray-400">
{event.minute}'
</div>

<div>{icon}</div>

<div>
{event.scorer || event.player || ""}
</div>

</div>

);

})}

</div>

</div>

{/* =====================================================
PLAYER RATINGS
===================================================== */}

{match.ratings && (

<div className="mt-10 bg-gray-800 p-6 rounded-xl">

<h2 className="text-xl font-bold mb-4">
Player Ratings
</h2>

<div className="grid grid-cols-2 gap-2">

{Object.entries(match.ratings).map(([playerId,rating])=>{

return(

<div
key={playerId}
className="flex justify-between border-b border-gray-700 py-1"
>

<div className="text-gray-300 truncate">
{playerId}
</div>

<div className="font-bold text-yellow-400">
{rating}
</div>

</div>

);

})}

</div>

</div>

)}

</div>

);

}