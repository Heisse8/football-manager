import { useEffect, useState } from "react";

/* =====================================================
LEAGUE CONFIG
===================================================== */

const leagueConfig = {

de: {
name:"Deutschland",
leagues:[
"Bundesliga",
"2. Bundesliga"
],
cups:["DFB Pokal"]
},

en:{
name:"England",
leagues:[
"Premier League",
"Championship"
],
cups:["FA Cup"]
},

es:{
name:"Spanien",
leagues:[
"La Liga",
"La Liga 2"
],
cups:["Copa del Rey"]
},

it:{
name:"Italien",
leagues:[
"Serie A",
"Serie B"
],
cups:["Coppa Italia"]
},

fr:{
name:"Frankreich",
leagues:[
"Ligue 1",
"Ligue 2"
],
cups:["Coupe de France"]
}

};

/* =====================================================
MAIN COMPONENT
===================================================== */

export default function CompetitionsPage(){

const [country,setCountry] = useState("de");
const [league,setLeague] = useState(null);

const [table,setTable] = useState([]);
const [matches,setMatches] = useState([]);
const [cups,setCups] = useState([]);

const [loading,setLoading] = useState(true);

/* =====================================================
LOAD DATA
===================================================== */

useEffect(()=>{

loadData();

const interval = setInterval(loadData,30000);

return ()=>clearInterval(interval);

},[league]);

const loadData = async ()=>{

try{

const res = await fetch(`/api/league/overview`);

if(!res.ok){
setLoading(false);
return;
}

const data = await res.json();

setTable(data.table || []);
setMatches(data.matches || []);
setCups(data.cups || []);

}catch(err){

console.error("Competitions Fehler:",err);

}

setLoading(false);

};

/* =====================================================
TABLE SORT
===================================================== */

const sortedTable = [...table].sort((a,b)=>{

if(b.points !== a.points)
return b.points - a.points;

const diffA = (a.goalsFor || 0) - (a.goalsAgainst || 0);
const diffB = (b.goalsFor || 0) - (b.goalsAgainst || 0);

return diffB - diffA;

});

/* =====================================================
MATCHDAY GROUPING
===================================================== */

function groupMatchdays(){

const grouped = {};

matches.forEach(match=>{

const md = match.matchday || 1;

if(!grouped[md])
grouped[md] = [];

grouped[md].push(match);

});

return grouped;

}

const matchdays = groupMatchdays();

/* =====================================================
FORMAT DATE
===================================================== */

function formatDate(date){

if(!date) return "-";

return new Date(date).toLocaleDateString("de-DE",{
day:"2-digit",
month:"2-digit"
});

}

/* =====================================================
LOADING
===================================================== */

if(loading){

return(

<div className="flex items-center justify-center h-screen text-white">

Ligen laden...

</div>

);

}

/* =====================================================
RENDER
===================================================== */

return(

<div className="max-w-[1600px] mx-auto p-8 text-white">

<h1 className="text-3xl font-bold mb-8">
🌍 Wettbewerbe
</h1>

{/* =====================================================
COUNTRY TABS
===================================================== */}

<div className="flex gap-3 mb-8 flex-wrap">

{Object.entries(leagueConfig).map(([key,value])=>(

<button
key={key}
onClick={()=>setCountry(key)}
className={`px-4 py-2 rounded ${
country===key
? "bg-yellow-500 text-black"
: "bg-gray-800"
}`}
>
{value.name}
</button>

))}

</div>

{/* =====================================================
LEAGUE TABS
===================================================== */}

<div className="flex gap-3 mb-10 flex-wrap">

{leagueConfig[country].leagues.map(l=>(

<button
key={l}
onClick={()=>setLeague(l)}
className={`px-4 py-2 rounded ${
league===l
? "bg-blue-600"
: "bg-gray-800"
}`}
>
{l}
</button>

))}

</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

{/* =====================================================
TABLE
===================================================== */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-semibold mb-4">
Tabelle
</h2>

<div className="grid grid-cols-6 text-xs opacity-70 mb-2">

<span>#</span>
<span>Team</span>
<span>Sp</span>
<span>TD</span>
<span>Pkt</span>
<span></span>

</div>

<div className="space-y-1 text-sm">

{sortedTable.map((club,i)=>{

const diff = (club.goalsFor||0)-(club.goalsAgainst||0);

return(

<div
key={club._id}
className="grid grid-cols-6 px-2 py-1 hover:bg-white/10 rounded"
>

<span>{i+1}</span>

<span className="truncate">
{club.name}
</span>

<span>
{club.played || 0}
</span>

<span className={diff>=0?"text-green-400":"text-red-400"}>

{diff>=0?`+${diff}`:diff}

</span>

<span className="font-semibold">
{club.points || 0}
</span>

<span></span>

</div>

);

})}

</div>

</div>

{/* =====================================================
MATCHDAYS
===================================================== */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-semibold mb-4">
Spieltage
</h2>

<div className="space-y-6 max-h-[600px] overflow-y-auto">

{Object.entries(matchdays).map(([md,mdMatches])=>(

<div key={md}>

<div className="font-semibold mb-2">
Spieltag {md}
</div>

<div className="space-y-1">

{mdMatches.map(match=>(

<div
key={match._id}
className="flex justify-between bg-black/30 px-3 py-2 rounded text-sm"
>

<span>
{match.homeTeam?.name}
</span>

<span>

{match.played
? `${match.homeGoals} : ${match.awayGoals}`
: formatDate(match.date)}

</span>

<span>
{match.awayTeam?.name}
</span>

</div>

))}

</div>

</div>

))}

</div>

</div>

</div>

{/* =====================================================
CUPS
===================================================== */}

{cups.length > 0 && (

<div className="bg-black/50 p-6 rounded-xl mt-10">

<h2 className="font-semibold mb-4">
🏆 Pokal
</h2>

<div className="space-y-4">

{cups.map(cup=>(

<div key={cup.name}>

<div className="font-semibold mb-2">
{cup.name} – {cup.round}
</div>

<div className="space-y-1">

{cup.matches.map(match=>(

<div
key={match._id}
className="flex justify-between bg-black/30 px-3 py-2 rounded text-sm"
>

<span>
{match.homeTeam?.name}
</span>

<span>

{match.played
? `${match.homeGoals}:${match.awayGoals}`
: formatDate(match.date)}

</span>

<span>
{match.awayTeam?.name}
</span>

</div>

))}

</div>

</div>

))}

</div>

</div>

)}

</div>

);

}