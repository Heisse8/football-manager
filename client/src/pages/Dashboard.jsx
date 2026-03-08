import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/manager-office.jpg";

export default function Dashboard() {

const navigate = useNavigate();

const [team, setTeam] = useState(null);
const [league, setLeague] = useState([]);
const [news, setNews] = useState([]);
const [nextMatch, setNextMatch] = useState(null);
const [loading, setLoading] = useState(true);

/* ================= LOAD DASHBOARD ================= */

useEffect(() => {

const fetchDashboard = async () => {

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
setNextMatch(data.nextMatch || null);
setNews(data.news || []);

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

const sortedLeague = [...league].sort((a,b)=>{

if(b.points !== a.points) return b.points - a.points;

const diffA = (a.goalsFor || 0) - (a.goalsAgainst || 0);
const diffB = (b.goalsFor || 0) - (b.goalsAgainst || 0);

return diffB - diffA;

});

/* ================= RENDER ================= */

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
{team?.name}
</h1>

<div className="text-yellow-400 text-xl font-semibold">
💰 {team?.balance?.toLocaleString()} €
</div>

</div>

{/* GRID */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

{/* ================= TABLE ================= */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-bold mb-4">
Tabelle
</h2>

{sortedLeague.slice(0,10).map((club,i)=>{

const isMine = team && club._id === team._id;

return(

<div
key={club._id}
className={`flex justify-between px-3 py-2 rounded ${
isMine
? "bg-green-600/30 border-l-4 border-green-400"
: "hover:bg-white/10"
}`}
>

<span>{i+1}. {club.name}</span>
<span>{club.points}</span>

</div>

);

})}

</div>

{/* ================= NEWS ================= */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-bold mb-4">
Manager News
</h2>

{news.length === 0 && (
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

{nextMatch ? (

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

) : (

<div className="opacity-60 text-center">
Kein Spiel geplant
</div>

)}

</div>

</div>

</div>

</div>

);

}