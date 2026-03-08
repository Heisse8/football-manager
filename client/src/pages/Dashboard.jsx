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
const [teamForm,setTeamForm] = useState([]);
const [stadium,setStadium] = useState(null);
const [playerOfMonth,setPlayerOfMonth] = useState(null);
const [finance,setFinance] = useState(null);

const [loading,setLoading] = useState(true);

/* ================= LOAD DASHBOARD ================= */

useEffect(()=>{

const fetchDashboard = async ()=>{

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

if(res.status === 404){
navigate("/create-team");
return;
}

const data = await res.json();

setTeam(data.team || null);
setLeague(data.league || []);
setNews(data.news || []);

setNextMatch(data.nextMatch || null);
setNextMatch2(data.nextMatch2 || null);

setTopScorers(data.topScorers || []);
setTeamForm(data.teamForm || []);
setStadium(data.stadium || null);
setPlayerOfMonth(data.playerOfMonth || null);
setFinance(data.finance || null);

}catch(err){

console.error("Dashboard Fehler:",err);

}

setLoading(false);

};

fetchDashboard();

},[navigate]);

/* ================= LOADING ================= */

if(loading){

return(
<div className="p-10 text-white animate-pulse">
Dashboard lädt...
</div>
);

}

/* ================= SORT TABLE ================= */

const sortedLeague=[...league].sort((a,b)=>{

if(b.points !== a.points) return b.points-a.points;

const diffA=(a.goalsFor||0)-(a.goalsAgainst||0);
const diffB=(b.goalsFor||0)-(b.goalsAgainst||0);

return diffB-diffA;

});

/* ================= RENDER ================= */

return(

<div
className="relative min-h-screen text-white bg-cover bg-center"
style={{backgroundImage:`url(${bgImage})`}}
>

<div className="absolute inset-0 bg-black/80"></div>

<div className="relative z-10 p-8 max-w-[1800px] mx-auto">

{/* HEADER */}

<div className="flex justify-between mb-8">

<h1 className="text-3xl font-bold">
{team?.name}
</h1>

<div className="text-yellow-400 text-xl font-semibold">
💰 {team?.balance?.toLocaleString()} €
</div>

</div>

{/* ================= GRID 1 ================= */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

{/* ================= TABLE ================= */}

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

<div className="space-y-1 text-sm max-h-[650px] overflow-y-auto">

{sortedLeague.map((club,i)=>{

const isMine = team && club._id === team._id;
const goalDiff=(club.goalsFor||0)-(club.goalsAgainst||0);

return(

<div
key={club._id}
className={`grid grid-cols-5 px-2 py-1 rounded ${
isMine
? "bg-green-600/30 border-l-4 border-green-400"
: "hover:bg-white/10"
}`}
>

<span>{i+1}</span>

<span className="truncate">
{club.name}
</span>

<span>
{club.played||0}
</span>

<span className={goalDiff>=0?"text-green-400":"text-red-400"}>
{goalDiff>=0?`+${goalDiff}`:goalDiff}
</span>

<span className="font-semibold">
{club.points}
</span>

</div>

);

})}

</div>

</div>

{/* ================= NEWS ================= */}

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
<div key={n._id} className="bg-black/30 p-4 rounded mb-3">

<div className="font-semibold">
{n.title}
</div>

<div className="text-sm opacity-80">
{n.content}
</div>

</div>
))}

</div>

{/* ================= NEXT MATCH ================= */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-bold mb-4">
Nächstes Spiel
</h2>

{nextMatch ?(

<div className="text-center">

<div>
{new Date(nextMatch.date).toLocaleDateString("de-DE")}
</div>

<div className="text-xl font-bold mt-3">
{nextMatch.homeTeam?.name}
</div>

<div>vs</div>

<div className="text-xl font-bold">
{nextMatch.awayTeam?.name}
</div>

</div>

):(

<div className="opacity-60 text-center">
Kein Spiel geplant
</div>

)}

{nextMatch2 &&(

<div className="mt-6 border-t border-white/20 pt-4 text-center">

<div className="text-sm opacity-70 mb-2">
Übernächstes Spiel
</div>

<div>
{new Date(nextMatch2.date).toLocaleDateString("de-DE")}
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

</div>

</div>

{/* ================= GRID 2 ================= */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

{/* ================= TOP SCORERS ================= */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-bold mb-4">
Top Scorer
</h2>

{topScorers.map((p,i)=>(

<div key={p._id} className="flex justify-between py-1">

<span>
{i+1}. {p.firstName} {p.lastName}
</span>

<span className="text-yellow-400">
⚽ {p.seasonStats?.goals || 0}
</span>

</div>

))}

</div>

{/* ================= TEAM FORM ================= */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-bold mb-4">
Form (letzte 5)
</h2>

<div className="flex gap-2">

{teamForm.map((m,i)=>{

const isHome = m.homeTeam?._id === team._id;

const goalsFor = isHome ? m.homeGoals : m.awayGoals;
const goalsAgainst = isHome ? m.awayGoals : m.homeGoals;

let color="bg-gray-500";

if(goalsFor>goalsAgainst) color="bg-green-500";
if(goalsFor<goalsAgainst) color="bg-red-500";
if(goalsFor===goalsAgainst) color="bg-yellow-500";

return(

<div
key={i}
className={`w-10 h-10 rounded ${color} flex items-center justify-center`}
>

{goalsFor}:{goalsAgainst}

</div>

);

})}

</div>

</div>

{/* ================= STADIUM ================= */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-bold mb-4">
Stadion
</h2>

{stadium &&(

<div>

<div>
Kapazität: {stadium.capacity?.toLocaleString()}
</div>

<div>
Ticketpreis: {stadium.ticketPrice} €
</div>

<div>
Letzte Einnahmen: {team?.lastMatchRevenue?.toLocaleString()} €
</div>

</div>

)}

</div>

{/* ================= PLAYER OF MONTH ================= */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-bold mb-4">
Spieler des Monats
</h2>

{playerOfMonth &&(

<div>

<div className="text-lg font-semibold">
{playerOfMonth.firstName} {playerOfMonth.lastName}
</div>

<div className="opacity-70">
Rating: {playerOfMonth.seasonStats?.rating || 0}
</div>

<div className="opacity-70">
Tore: {playerOfMonth.seasonStats?.goals || 0}
</div>

</div>

)}

</div>

{/* ================= FINANCE ================= */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-bold mb-4">
Finanzen
</h2>

{finance &&(

<div>

<div>
Kontostand
</div>

<div className="text-yellow-400 text-xl">
{finance.balance?.toLocaleString()} €
</div>

<div className="mt-2 opacity-70">
Letzte Einnahmen
</div>

<div>
{finance.lastRevenue?.toLocaleString()} €
</div>

</div>

)}

</div>

</div>

</div>

</div>

);

}