import { useEffect, useState } from "react";

export default function Transfermarkt(){

const [tab,setTab] = useState("players");
const [data,setData] = useState([]);

const [search,setSearch] = useState("");
const [position,setPosition] = useState("");
const [stars,setStars] = useState("");
const [sort,setSort] = useState("");

/* =====================================================
LOAD MARKET
===================================================== */

useEffect(()=>{

loadMarket();

const interval = setInterval(loadMarket,15000);

return ()=>clearInterval(interval);

},[tab]);

const loadMarket = async ()=>{

try{

const res = await fetch(`/api/market/${tab}`);
const result = await res.json();

setData(result);

}catch(err){

console.error(err);

}

};

/* =====================================================
BID
===================================================== */

const placeBid = async (player)=>{

const token = localStorage.getItem("token");

const amount = prompt("Gebot eingeben");

if(!amount) return;

await fetch("/api/market/bid",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
playerId:player._id,
bid:Number(amount)
})

});

loadMarket();

};

/* =====================================================
BUY SCOUT
===================================================== */

const buyScout = async (scout)=>{

const token = localStorage.getItem("token");

await fetch("/api/market/buy-scout",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
scoutId:scout._id
})

});

loadMarket();

};

/* =====================================================
BUY COACH
===================================================== */

const buyCoach = async (coach)=>{

const token = localStorage.getItem("token");

await fetch("/api/market/buy-coach",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
coachId:coach._id
})

});

loadMarket();

};

/* =====================================================
FILTER
===================================================== */

let filtered = [...data];

if(search){

filtered = filtered.filter(p =>
`${p.firstName || ""} ${p.lastName || ""}`
.toLowerCase()
.includes(search.toLowerCase())
);

}

if(position){

filtered = filtered.filter(p =>
p.positions?.includes(position)
);

}

if(stars){

filtered = filtered.filter(p =>
p.stars >= Number(stars)
);

}

/* =====================================================
SORT
===================================================== */

if(sort === "price"){

filtered.sort((a,b)=>b.highestBid - a.highestBid);

}

if(sort === "stars"){

filtered.sort((a,b)=>b.stars - a.stars);

}

if(sort === "age"){

filtered.sort((a,b)=>a.age - b.age);

}

/* =====================================================
TIMER
===================================================== */

function getRemainingTime(date){

if(!date) return "-";

const end = new Date(date);
const now = new Date();

const diff = end - now;

if(diff <= 0) return "Beendet";

const hours = Math.floor(diff / 1000 / 60 / 60);
const minutes = Math.floor((diff / 1000 / 60) % 60);

return `${hours}h ${minutes}m`;

}

/* =====================================================
UI
===================================================== */

return(

<div className="max-w-[1200px] mx-auto p-8 text-white">

<h1 className="text-3xl font-bold mb-6">
💸 Transfermarkt
</h1>

{/* =====================================================
TABS
===================================================== */}

<div className="flex gap-4 mb-6">

<button
onClick={()=>setTab("players")}
className={`px-4 py-2 rounded ${tab==="players" ? "bg-blue-600" : "bg-gray-700"}`}
>
Spieler
</button>

<button
onClick={()=>setTab("scouts")}
className={`px-4 py-2 rounded ${tab==="scouts" ? "bg-blue-600" : "bg-gray-700"}`}
>
Scouts
</button>

<button
onClick={()=>setTab("coaches")}
className={`px-4 py-2 rounded ${tab==="coaches" ? "bg-blue-600" : "bg-gray-700"}`}
>
Trainer
</button>

</div>

{/* =====================================================
FILTER BAR
===================================================== */}

{tab==="players" && (

<div className="flex flex-wrap gap-3 mb-6">

<input
placeholder="Spieler suchen..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="bg-gray-800 px-3 py-2 rounded"
/>

<select
value={position}
onChange={(e)=>setPosition(e.target.value)}
className="bg-gray-800 px-3 py-2 rounded"
>

<option value="">Position</option>
<option>ST</option>
<option>LW</option>
<option>RW</option>
<option>CAM</option>
<option>CM</option>
<option>CDM</option>
<option>CB</option>
<option>LB</option>
<option>RB</option>
<option>GK</option>

</select>

<select
value={stars}
onChange={(e)=>setStars(e.target.value)}
className="bg-gray-800 px-3 py-2 rounded"
>

<option value="">Stars</option>
<option value="1">1+</option>
<option value="2">2+</option>
<option value="3">3+</option>
<option value="4">4+</option>
<option value="5">5</option>

</select>

<select
value={sort}
onChange={(e)=>setSort(e.target.value)}
className="bg-gray-800 px-3 py-2 rounded"
>

<option value="">Sortieren</option>
<option value="price">Preis</option>
<option value="stars">Stars</option>
<option value="age">Alter</option>

</select>

</div>

)}

{/* =====================================================
GRID
===================================================== */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

{tab==="players" && filtered.map((p)=>(

<div key={p._id} className="bg-black/50 p-5 rounded-xl">

<div className="font-semibold text-lg">
{p.firstName} {p.lastName}
</div>

<div className="text-sm text-gray-400">
Position: {p.positions?.join(", ")}
</div>

<div className="text-sm">
⭐ {p.stars}
</div>

<div className="text-sm">
Alter: {p.age}
</div>

<div className="text-yellow-400 mt-2">
Gebot: € {p.highestBid?.toLocaleString()}
</div>

<div className="text-xs text-gray-400">
Ende in: {getRemainingTime(p.auctionEnd)}
</div>

<button
onClick={()=>placeBid(p)}
className="bg-green-600 hover:bg-green-500 mt-4 px-3 py-2 rounded w-full"
>
Gebot abgeben
</button>

</div>

))}

{tab==="scouts" && filtered.map((s)=>(

<div key={s._id} className="bg-black/50 p-5 rounded-xl">

<div className="font-semibold text-lg">
Scout ⭐{s.stars}
</div>

<div className="text-yellow-400 mt-2">
Preis: € {s.transferPrice?.toLocaleString()}
</div>

<button
onClick={()=>buyScout(s)}
className="bg-green-600 hover:bg-green-500 mt-4 px-3 py-2 rounded w-full"
>
Scout verpflichten
</button>

</div>

))}

{tab==="coaches" && filtered.map((c)=>(

<div key={c._id} className="bg-black/50 p-5 rounded-xl">

<div className="font-semibold text-lg">
{c.name}
</div>

<div className="text-sm">
⭐ {c.stars}
</div>

<div className="text-yellow-400 mt-2">
Preis: € {c.transferPrice?.toLocaleString()}
</div>

<button
onClick={()=>buyCoach(c)}
className="bg-green-600 hover:bg-green-500 mt-4 px-3 py-2 rounded w-full"
>
Trainer verpflichten
</button>

</div>

))}

</div>

</div>

);

}