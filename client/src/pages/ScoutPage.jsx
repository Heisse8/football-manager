import { useEffect, useState } from "react";

export default function ScoutPage(){

const [scouts,setScouts] = useState([]);
const [missions,setMissions] = useState([]);
const [loading,setLoading] = useState(true);

const [region,setRegion] = useState("europa");
const [duration,setDuration] = useState(3);

/* =====================================================
LOAD DATA
===================================================== */

useEffect(()=>{

loadData();

const interval = setInterval(loadData,20000);

return ()=>clearInterval(interval);

},[]);

const loadData = async ()=>{

try{

const token = localStorage.getItem("token");

const headers = {
Authorization:`Bearer ${token}`
};

const [scoutRes,networkRes] = await Promise.all([

fetch("/api/market/scouts",{headers}),
fetch("/api/scout/network",{headers})

]);

if(scoutRes.ok){

const scoutData = await scoutRes.json();
setScouts(Array.isArray(scoutData) ? scoutData : []);

}

if(networkRes.ok){

const networkData = await networkRes.json();
setMissions(Array.isArray(networkData) ? networkData : []);

}

}catch(err){

console.error("ScoutPage Fehler:",err);

}

setLoading(false);

};

/* =====================================================
START MISSION
===================================================== */

const startMission = async (scoutId)=>{

try{

const token = localStorage.getItem("token");

await fetch("/api/scout/mission",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
scoutId,
region,
duration
})

});

loadData();

}catch(err){

console.error(err);

}

};

/* =====================================================
SIGN PLAYER
===================================================== */

const signPlayer = async (missionId,index)=>{

try{

const token = localStorage.getItem("token");

await fetch("/api/scout/sign",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
missionId,
playerIndex:index
})

});

loadData();

}catch(err){

console.error(err);

}

};

/* =====================================================
REJECT PLAYER
===================================================== */

const rejectPlayer = async (missionId,index)=>{

try{

const token = localStorage.getItem("token");

await fetch("/api/scout/reject",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
missionId,
playerIndex:index
})

});

loadData();

}catch(err){

console.error(err);

}

};

/* =====================================================
UI
===================================================== */

if(loading){

return(
<div className="p-10 text-white">
Scout Netzwerk lädt...
</div>
);

}

return(

<div className="max-w-[1200px] mx-auto p-8 text-white">

<h1 className="text-3xl font-bold mb-6">
🕵️ Scouting
</h1>

{/* =====================================================
MISSION SETTINGS
===================================================== */}

<div className="bg-black/50 p-6 rounded-xl mb-8">

<h2 className="font-semibold mb-4">
Mission Einstellungen
</h2>

<div className="flex gap-4">

<select
value={region}
onChange={(e)=>setRegion(e.target.value)}
className="bg-gray-800 px-3 py-2 rounded"
>

<option value="europa">Europa</option>
<option value="suedamerika">Südamerika</option>
<option value="afrika">Afrika</option>
<option value="asien">Asien</option>
<option value="nordamerika">Nordamerika</option>
<option value="australien">Australien</option>

</select>

<select
value={duration}
onChange={(e)=>setDuration(Number(e.target.value))}
className="bg-gray-800 px-3 py-2 rounded"
>

<option value={3}>3 Tage</option>
<option value={7}>7 Tage</option>
<option value={14}>14 Tage</option>

</select>

</div>

</div>

{/* =====================================================
SCOUTS
===================================================== */}

<h2 className="text-xl font-semibold mb-4">
Deine Scouts
</h2>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

{scouts.map((scout)=>(

<div key={scout._id} className="bg-black/50 p-5 rounded-xl">

<div className="font-semibold text-lg">

{scout.firstName} {scout.lastName}

</div>

<div className="text-sm text-gray-400">

⭐ {scout.stars}

</div>

<div className="text-sm text-gray-400">

Region Spezialität: {scout.regionSpecialty || "-"}

</div>

<button
onClick={()=>startMission(scout._id)}
className="bg-green-600 hover:bg-green-500 mt-4 px-3 py-2 rounded w-full"
>

Mission starten

</button>

</div>

))}

</div>

{/* =====================================================
SCOUT RESULTS
===================================================== */}

<h2 className="text-xl font-semibold mb-4">
Scout Netzwerk
</h2>

<div className="space-y-6">

{missions.map((mission)=>(

<div key={mission._id} className="bg-black/50 p-6 rounded-xl">

<div className="font-semibold mb-4">

Scout: {mission.scout?.firstName} {mission.scout?.lastName}

</div>

<div className="grid md:grid-cols-3 gap-4">

{mission.results?.map((player,index)=>(

<div key={index} className="bg-gray-900 p-4 rounded">

<div className="font-semibold">

{player.firstName} {player.lastName}

</div>

<div className="text-sm text-gray-400">

Alter: {player.age}

</div>

<div className="text-sm">

Position: {player.positions?.join(", ")}

</div>

<div className="text-yellow-400">

⭐ {player.stars}

</div>

<div className="flex gap-2 mt-3">

<button
onClick={()=>signPlayer(mission._id,index)}
className="bg-green-600 px-3 py-2 rounded w-full"
>

Verpflichten

</button>

<button
onClick={()=>rejectPlayer(mission._id,index)}
className="bg-red-600 px-3 py-2 rounded w-full"
>

Ablehnen

</button>

</div>

</div>

))}

</div>

</div>

))}

</div>

</div>

);

}