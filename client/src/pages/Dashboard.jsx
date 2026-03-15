import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/manager-office.jpg";

export default function Dashboard() {

const navigate = useNavigate();

const [team,setTeam] = useState(null);
const [league,setLeague] = useState([]);
const [news,setNews] = useState([]);
const [nextMatch,setNextMatch] = useState(null);
const [nextMatch2,setNextMatch2] = useState(null);
const [topScorers,setTopScorers] = useState([]);

const [loading,setLoading] = useState(true);

/* =====================================================
LOAD DASHBOARD
===================================================== */

useEffect(()=>{

let mounted = true;

const load = async()=>{

try{

const token = localStorage.getItem("token");

if(!token){
navigate("/login");
return;
}

const res = await fetch("/api/dashboard",{
headers:{
Authorization:`Bearer ${token}`
}
});

/* TOKEN EXPIRED */

if(res.status === 401){

localStorage.removeItem("token");
navigate("/login");
return;

}

/* USER HAT NOCH KEIN TEAM */

if(res.status === 404){

navigate("/create-team");
return;

}

const data = await res.json();

if(!mounted) return;

setTeam(data.team || null);
setLeague(data.league || []);
setNews(data.news || []);
setNextMatch(data.nextMatch || null);
setNextMatch2(data.nextMatch2 || null);
setTopScorers(data.topScorers || []);

}catch(err){

console.error("Dashboard Fehler:",err);

}

if(mounted){
setLoading(false);
}

};

/* INITIAL LOAD */

load();

/* AUTO REFRESH */

const interval = setInterval(load,30000);

return ()=>{

mounted = false;
clearInterval(interval);

};

},[navigate]);

/* =====================================================
LOADING SCREEN
===================================================== */

if(loading){

return(

<div className="flex items-center justify-center h-screen text-white bg-gray-900">

<div className="animate-pulse text-xl">
Dashboard lädt...
</div>

</div>

);

}

/* =====================================================
SORT TABLE
===================================================== */

const sortedLeague = league
? [...league].sort((a,b)=>{

if((b.points||0)!==(a.points||0))
return (b.points||0)-(a.points||0);

const diffA=(a.goalsFor||0)-(a.goalsAgainst||0);
const diffB=(b.goalsFor||0)-(b.goalsAgainst||0);

return diffB-diffA;

})
: [];

/* =====================================================
DATE FORMAT
===================================================== */

const formatDate = (date)=>{

if(!date) return "-";

return new Date(date).toLocaleDateString("de-DE");

};

/* =====================================================
RENDER
===================================================== */

return(

<div
className="relative min-h-screen text-white bg-cover bg-center"
style={{ backgroundImage:`url(${bgImage})` }}
>

<div className="absolute inset-0 bg-black/80"></div>

<div className="relative z-10 p-8 max-w-[1800px] mx-auto">

{/* HEADER */}

<div className="flex justify-between mb-8">

<h1 className="text-3xl font-bold">
{team?.name || "Mein Verein"}
</h1>

<div className="text-yellow-400 text-xl font-semibold">
💰 {team?.balance?.toLocaleString() || 0} €
</div>

</div>

{/* GRID */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

{/* =====================================================
TABLE
===================================================== */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-bold mb-4">
Tabelle
</h2>

<div className="grid grid-cols-5 text-xs opacity-70 mb-2 px-2">

<span>#</span>
<span>Team</span>
<span>Sp</span>
<span>TD</span>
<span>Pkt</span>

</div>

<div className="space-y-1 text-sm">

{sortedLeague.map((club,i)=>{

const isMine = team && club._id === team._id;

const goalDiff =
(club.goalsFor||0)-(club.goalsAgainst||0);

return(

<div
key={club._id}
onClick={()=>navigate(`/team/${club._id}`)}
className={`cursor-pointer grid grid-cols-5 px-2 py-1 rounded ${
isMine
? "bg-green-600/30 border-l-4 border-green-400"
: "hover:bg-white/10 hover:scale-[1.01] transition"
}`}
>


<span>{i+1}</span>

<span className="truncate">
{club.name}
</span>

<span>
{club.played||0}
</span>

<span
className={
goalDiff>=0
? "text-green-400"
: "text-red-400"
}
>

{goalDiff>=0
? `+${goalDiff}`
: goalDiff}

</span>

<span className="font-semibold">
{club.points||0}
</span>

</div>

);

})}

</div>

</div>

{/* =====================================================
NEWS
===================================================== */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-bold mb-4">
Manager News
</h2>

{news.length===0 &&(

<div className="opacity-60 text-center">
Keine News verfügbar
</div>

)}

{news.slice(0,5).map((n)=>(

<div
key={n._id}
className="bg-black/30 p-4 rounded mb-3"
>

<div className="font-semibold">
{n.title}
</div>

<div className="text-xs opacity-60 mb-1">
{formatDate(n.createdAt)}
</div>

<div className="text-sm opacity-80">
{n.content}
</div>


</div>

))}

</div>

{/* =====================================================
MATCH + TOP SCORERS
===================================================== */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-bold mb-4">
Nächstes Spiel
</h2>

{nextMatch ? (

<div className="text-center">

<div>
{formatDate(nextMatch.date)}
</div>

<div className="text-xl font-bold mt-3">
{nextMatch.homeTeam?.name}
</div>

<div>vs</div>

<div className="text-xl font-bold">
{nextMatch.awayTeam?.name}
</div>

</div>

) : (

<div className="opacity-60 text-center">
Kein Spiel geplant
</div>

)}

{/* NEXT MATCH 2 */}

{nextMatch2 && (

<div className="mt-6 border-t border-white/20 pt-4 text-center">

<div className="text-sm opacity-70 mb-2">
Übernächstes Spiel
</div>

<div>
{formatDate(nextMatch2.date)}
</div>

<div className="font-semibold mt-2">
{nextMatch2.homeTeam?.name}
</div>

<div>vs</div>

<div className="font-semibold">
{nextMatch2.awayTeam?.name}
</div>

</div>

)}

{/* TOP SCORERS */}

<div className="mt-6 border-t border-white/20 pt-4">

<h3 className="font-semibold mb-3 text-center">
Top Torjäger
</h3>

{topScorers.map((p,i)=>(

<div
key={p._id}
className="flex justify-between py-1 text-sm"
>

<span>

{i+1}. {p.firstName} {p.lastName}

</span>

<span className="text-yellow-400">

⚽ {p.seasonStats?.goals || 0}

</span>

</div>

))}

</div>

</div>

</div>

</div>

</div>

);

}