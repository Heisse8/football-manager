import { useEffect, useState } from "react";

export default function Stadium(){

const [stadium,setStadium] = useState(null);
const [loading,setLoading] = useState(true);

const [newName,setNewName] = useState("");
const [ticketPrice,setTicketPrice] = useState(15);

/* =====================================================
LOAD STADIUM
===================================================== */

useEffect(()=>{

loadStadium();

},[]);

const loadStadium = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await fetch("/api/stadium",{
headers:{Authorization:`Bearer ${token}`}
});

if(!res.ok) return;

const data = await res.json();

setStadium(data);
setTicketPrice(data.ticketPrice);

}catch(err){

console.error(err);

}

setLoading(false);

};

/* =====================================================
SET NAME
===================================================== */

const setName = async ()=>{

if(!newName.trim()) return;

try{

const token = localStorage.getItem("token");

await fetch("/api/stadium/set-name",{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({name:newName})
});

setNewName("");

loadStadium();

}catch(err){

console.error(err);

}

};

/* =====================================================
SET TICKET PRICE
===================================================== */

const updateTicketPrice = async ()=>{

try{

const token = localStorage.getItem("token");

await fetch("/api/stadium/ticket-price",{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({price:Number(ticketPrice)})
});

loadStadium();

}catch(err){

console.error(err);

}

};

/* =====================================================
START EXPANSION
===================================================== */

const startExpansion = async ()=>{

try{

const token = localStorage.getItem("token");

await fetch("/api/stadium/expand",{
method:"POST",
headers:{Authorization:`Bearer ${token}`}
});

loadStadium();

}catch(err){

console.error(err);

}

};

/* =====================================================
ATTENDANCE CALCULATION
===================================================== */

function calculateAttendance(){

if(!stadium) return 0;

let demand = (stadium.fanBase || 1) * 1000;

let priceFactor = 1 - (ticketPrice / 120);

let attendance = demand * priceFactor;

attendance = Math.max(500, attendance);

return Math.min(stadium.capacity, Math.round(attendance));

}

const attendance = calculateAttendance();

const utilization = stadium
? Math.round((attendance / stadium.capacity) * 100)
: 0;

/* =====================================================
LOADING
===================================================== */

if(loading){

return(
<div className="p-10 text-white">
Stadion lädt...
</div>
);

}

if(!stadium) return null;

/* =====================================================
RENDER
===================================================== */

return(

<div className="max-w-[1200px] mx-auto p-8 text-white">

<h1 className="text-3xl font-bold mb-6">
🏟 Stadion
</h1>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{/* ================= STADIUM INFO ================= */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="text-xl font-semibold mb-4">
{stadium.name}
</h2>

<div className="space-y-2 text-sm">

<div className="flex justify-between">
<span>Kapazität</span>
<span>{stadium.capacity?.toLocaleString()}</span>
</div>

<div className="flex justify-between">
<span>Ticketpreis</span>
<span>{stadium.ticketPrice} €</span>
</div>

<div className="flex justify-between">
<span>Einnahmen letztes Spiel</span>
<span className="text-yellow-400">
€ {stadium.lastMatchRevenue?.toLocaleString()}
</span>
</div>

</div>

</div>

{/* ================= NAME CHANGE ================= */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="text-xl font-semibold mb-4">
Stadionname ändern
</h2>

{stadium.nameLocked ? (

<p className="text-gray-400 text-sm">
Der Stadionname wurde bereits geändert.
</p>

):(

<div className="flex gap-2">

<input
value={newName}
onChange={(e)=>setNewName(e.target.value)}
placeholder="Neuer Stadionname"
className="bg-gray-800 px-3 py-2 rounded w-full"
/>

<button
onClick={setName}
className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
>
Ändern
</button>

</div>

)}

</div>

{/* ================= TICKET PRICE ================= */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="text-xl font-semibold mb-4">
Ticketpreis
</h2>

<input
type="range"
min="5"
max="100"
value={ticketPrice}
onChange={(e)=>setTicketPrice(Number(e.target.value))}
className="w-full"
/>

<div className="flex justify-between text-sm mt-2">

<span>5€</span>
<span>{ticketPrice} €</span>
<span>100€</span>

</div>

<div className="mt-3 text-sm space-y-1">

<div className="flex justify-between">
<span>Geschätzte Zuschauer</span>
<span>
{attendance.toLocaleString()} / {stadium.capacity.toLocaleString()}
</span>
</div>

<div className="flex justify-between">
<span>Auslastung</span>
<span>{utilization}%</span>
</div>

</div>

<button
onClick={updateTicketPrice}
className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 mt-4 w-full"
>
Ticketpreis speichern
</button>

</div>

{/* ================= STADIUM EXPANSION ================= */}

<div className="bg-black/50 p-6 rounded-xl">

<h2 className="text-xl font-semibold mb-4">
Stadion Ausbau
</h2>

{stadium.construction?.inProgress ? (

<div>

<div className="mb-3">
Ausbau läuft...
</div>

<div className="w-full bg-gray-700 h-4 rounded">

<div
className="bg-green-500 h-4 rounded"
style={{width:`${stadium.progress}%`}}
></div>

</div>

<div className="text-sm text-gray-400 mt-2">

Restzeit:

{stadium.remainingTime?.weeks}w
{" "}
{stadium.remainingTime?.days}d
{" "}
{stadium.remainingTime?.hours}h

</div>

</div>

):(

<div>

{stadium.nextExpansion ? (

<>

<div className="text-sm mb-4 space-y-1">

<div>
Neue Kapazität: {stadium.nextExpansion.next.toLocaleString()}
</div>

<div>
Kosten: € {stadium.nextExpansion.cost.toLocaleString()}
</div>

<div>
Dauer: {stadium.nextExpansion.duration} Spieltage
</div>

</div>

<button
onClick={startExpansion}
className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded w-full"
>
Stadion ausbauen
</button>

</>

):(

<div className="text-gray-400">
Maximale Stadiongröße erreicht
</div>

)}

</div>

)}

</div>

</div>

</div>

);

}