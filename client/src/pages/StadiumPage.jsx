import { useEffect, useState } from "react";

export default function Stadium() {

const [team,setTeam] = useState(null);
const [loading,setLoading] = useState(true);

useEffect(()=>{

const load = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await fetch("/api/team",{
headers:{Authorization:`Bearer ${token}`}
});

if(!res.ok) return;

const data = await res.json();

setTeam(data);

}catch(err){
console.error(err);
}

setLoading(false);

};

load();

},[]);

if(loading){
return(
<div className="p-10 text-white">
Stadion lädt...
</div>
);
}

if(!team) return null;

return(

<div className="max-w-[1200px] mx-auto p-8 text-white">

<h1 className="text-3xl font-bold mb-6">
🏟 Stadion
</h1>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{/* STADIUM INFO */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="text-xl font-semibold mb-4">
{team.stadiumName}
</h2>

<div className="space-y-2 text-sm">

<div className="flex justify-between">
<span>Stadionlevel</span>
<span>{team.stadiumLevel}</span>
</div>

<div className="flex justify-between">
<span>Kapazität</span>
<span>{team.stadiumCapacity?.toLocaleString()}</span>
</div>

<div className="flex justify-between">
<span>Ticketpreis</span>
<span>{team.ticketPrice} €</span>
</div>

<div className="flex justify-between">
<span>Fans</span>
<span>{team.fanBase?.toLocaleString()}</span>
</div>

<div className="flex justify-between">
<span>Einnahmen letztes Spiel</span>
<span className="text-yellow-400">
€ {team.lastMatchRevenue?.toLocaleString()}
</span>
</div>

</div>

</div>

{/* STADIUM UPGRADE */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="text-xl font-semibold mb-4">
Stadion Ausbau
</h2>

<p className="text-sm text-gray-400 mb-4">
Baue dein Stadion aus um mehr Zuschauer und Einnahmen zu erhalten.
</p>

<button
className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
>
Stadion ausbauen
</button>

</div>

</div>

</div>

);

}