import { useEffect, useState } from "react";

export default function Finances(){

const [team,setTeam] = useState(null);
const [sponsors,setSponsors] = useState([]);
const [loading,setLoading] = useState(true);

/* =====================================================
LOAD DATA
===================================================== */

useEffect(()=>{

loadData();

},[]);

const loadData = async ()=>{

try{

const token = localStorage.getItem("token");

if(!token){
window.location="/login";
return;
}

const headers = {
Authorization:`Bearer ${token}`
};

/* ================= TEAM ================= */

const teamRes = await fetch("/api/team",{headers});

if(teamRes.status === 401){
localStorage.removeItem("token");
window.location="/login";
return;
}

const teamData = await teamRes.json();

setTeam(teamData);

/* ================= SPONSORS ================= */

if(!teamData.sponsor){

const sponsorRes = await fetch("/api/sponsor",{headers});
const sponsorData = await sponsorRes.json();

setSponsors(sponsorData);

}

}catch(err){

console.error("Finances Fehler:",err);

}

setLoading(false);

};

/* =====================================================
SIGN SPONSOR
===================================================== */

const signSponsor = async (sponsor)=>{

if(team?.sponsor) return;

try{

const token = localStorage.getItem("token");

await fetch("/api/sponsor/sign",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({sponsor})

});

loadData();

}catch(err){

console.error("Sponsor Fehler:",err);

}

};

/* =====================================================
LOADING
===================================================== */

if(loading){

return(

<div className="flex justify-center items-center h-screen text-white">
Finanzen laden...
</div>

);

}

if(!team) return null;

/* =====================================================
RENDER
===================================================== */

return(

<div className="max-w-[1200px] mx-auto p-8 text-white">

<h1 className="text-3xl font-bold mb-6">
💰 Finanzen
</h1>

{/* ================= TEAM MONEY ================= */}

<div className="bg-black/50 p-6 rounded-xl mb-6">

<div className="flex justify-between">
<span>Kontostand</span>
<span className="text-green-400">
€ {(team.balance || 0).toLocaleString()}
</span>
</div>

<div className="flex justify-between mt-2">
<span>Letzte Einnahmen</span>
<span className="text-yellow-400">
€ {(team.lastMatchRevenue || 0).toLocaleString()}
</span>
</div>

</div>

{/* ================= CURRENT SPONSOR ================= */}

<div className="bg-black/50 p-6 rounded-xl mb-6">

<h2 className="font-semibold mb-3">
Aktueller Sponsor
</h2>

{team.sponsor ? (

<div>

<div className="font-semibold">
{team.sponsor}
</div>

<div className="text-sm text-gray-400">
€ {(team.sponsorPayment || 0).toLocaleString()} pro Spiel
</div>

{/* Siegbonus */}

{team.sponsorWinBonus > 0 && (

<div className="text-xs text-yellow-400">
Siegbonus: € {team.sponsorWinBonus.toLocaleString()}
</div>

)}

{/* Saisonbonus */}

{team.sponsorSeasonBonus && (

<div className="text-xs text-green-400 mt-1">

{team.sponsorSeasonBonus.top10 && (
<div>Top 10: € {team.sponsorSeasonBonus.top10.toLocaleString()}</div>
)}

{team.sponsorSeasonBonus.top5 && (
<div>Top 5: € {team.sponsorSeasonBonus.top5.toLocaleString()}</div>
)}

{team.sponsorSeasonBonus.top3 && (
<div>Top 3: € {team.sponsorSeasonBonus.top3.toLocaleString()}</div>
)}

{team.sponsorSeasonBonus.champion && (
<div>Meister: € {team.sponsorSeasonBonus.champion.toLocaleString()}</div>
)}

</div>

)}

</div>

):(

<div className="text-gray-400">
Kein Sponsor aktiv
</div>

)}

</div>

{/* ================= SPONSOR OFFERS ================= */}

{!team.sponsor && (

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="font-semibold mb-4">
Sponsorenangebote
</h2>

<div className="grid grid-cols-3 gap-4">

{sponsors.map((s,i)=>(

<div key={i} className="bg-gray-900 p-4 rounded">

<div className="font-semibold">
{s.name}
</div>

<div className="text-sm text-gray-400">
€ {s.payment.toLocaleString()} / Spiel
</div>

{s.winBonus > 0 && (

<div className="text-xs text-yellow-400">
Siegbonus: € {s.winBonus.toLocaleString()}
</div>

)}

{s.seasonBonus && (

<div className="text-xs text-green-400 mt-1">

{s.seasonBonus.top10 && (
<div>Top 10: € {s.seasonBonus.top10.toLocaleString()}</div>
)}

{s.seasonBonus.top5 && (
<div>Top 5: € {s.seasonBonus.top5.toLocaleString()}</div>
)}

{s.seasonBonus.top3 && (
<div>Top 3: € {s.seasonBonus.top3.toLocaleString()}</div>
)}

{s.seasonBonus.champion && (
<div>Meister: € {s.seasonBonus.champion.toLocaleString()}</div>
)}

</div>

)}

<button
onClick={()=>signSponsor(s)}
className="bg-blue-600 hover:bg-blue-500 mt-3 px-3 py-2 rounded w-full"
>
Vertrag unterschreiben
</button>

</div>

))}

</div>

</div>

)}

</div>

);

}