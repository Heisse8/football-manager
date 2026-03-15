import { useEffect, useState } from "react";
import PlayerModal from "../components/PlayerModal";
export default function Transfermarkt(){

const [tab,setTab] = useState("players");
const [data,setData] = useState([]);

const [search,setSearch] = useState("");
const [position,setPosition] = useState("");
const [stars,setStars] = useState("");
const [sort,setSort] = useState("");
const [bidValues,setBidValues] = useState({});
const [loading,setLoading] = useState(true);
const [selectedPlayer,setSelectedPlayer] = useState(null);

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

setLoading(true);

const res = await fetch(`/api/market/${tab}`);

if(!res.ok){
setData([]);
setLoading(false);
return;
}

const result = await res.json();

setData(Array.isArray(result) ? result : []);

}catch(err){

console.error("Market Fehler:",err);

}

setLoading(false);

};

/* =====================================================
BID
===================================================== */

const placeBid = async (player)=>{

const token = localStorage.getItem("token");
if(!token) return;

const amount = Number(bidValues[player._id]);

if(!amount) return alert("Bitte Gebot eingeben");

try{

await fetch(`/api/team/bid/${player._id}`,{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
amount
})

});

loadMarket();

}catch(err){

console.error(err);

}

};

/* =====================================================
BUY SCOUT
===================================================== */

const buyScout = async (scout)=>{

const token = localStorage.getItem("token");

if(!token) return;

try{

await fetch(`/api/market/buy-scout/${scout._id}`,{

method:"POST",

headers:{
Authorization:`Bearer ${token}`
}

});

loadMarket();

}catch(err){

console.error(err);

}

};

/* =====================================================
BUY COACH
===================================================== */

const buyCoach = async (coach)=>{

const token = localStorage.getItem("token");

if(!token) return;

try{

await fetch(`/api/market/buy-coach/${coach._id}`,{

method:"POST",

headers:{
Authorization:`Bearer ${token}`
}

});

loadMarket();

}catch(err){

console.error(err);

}

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
(p.stars || 0) >= Number(stars)
);

}

/* =====================================================
SORT
===================================================== */

if(sort === "price"){

filtered.sort((a,b)=>(b.highestBid || 0) - (a.highestBid || 0));

}

if(sort === "stars"){

filtered.sort((a,b)=>(b.stars || 0) - (a.stars || 0));

}

if(sort === "age"){

filtered.sort((a,b)=>(a.age || 0) - (b.age || 0));

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
const seconds = Math.floor((diff / 1000) % 60);

if(hours > 0){
return `${hours}h ${minutes}m`;
}

if(minutes > 0){
return `${minutes}m ${seconds}s`;
}

return `${seconds}s`;

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

{loading && (

<div className="text-gray-400">
Lade Transfermarkt...
</div>

)}

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

{tab==="players" && filtered.map((p)=>(

<div
key={p._id}
onClick={()=>setSelectedPlayer(p)}
className="bg-black/50 p-5 rounded-xl cursor-pointer"
>

<div className="font-semibold text-lg">
{p.firstName} {p.lastName}
</div>

<div className="text-sm text-gray-400">
Position: {p.positions?.join(", ")}
</div>

<div className="text-yellow-400">
{"★".repeat(Math.round(p.stars || 0))}
</div>

<div className="text-sm">
Alter: {p.age}
</div>

<div className="text-sm text-gray-400">
Marktwert: € {(p.marketValue || 0).toLocaleString()}
</div>

<div className="text-yellow-400 mt-2">
Gebot: € {(p.highestBid || 0).toLocaleString()}
</div>

<div className="text-xs text-gray-400">
Ende in: {getRemainingTime(p.auctionEnd)}
</div>

<input
type="number"
placeholder="Gebot eingeben"
value={bidValues[p._id] || ""}
onChange={(e)=>setBidValues({
...bidValues,
[p._id]:e.target.value
})}
className="bg-gray-800 px-3 py-2 rounded w-full mt-3"
/>

<button
onClick={(e)=>{
e.stopPropagation();
placeBid(p);
}}
className="bg-green-600 hover:bg-green-500 mt-2 px-3 py-2 rounded w-full"
>
Gebot abgeben
</button>

</div>

))}

{tab==="scouts" && filtered.map((s)=>(

<div key={s._id} className="bg-black/50 p-5 rounded-xl">

<div className="font-semibold text-lg">
Scout {"★".repeat(Math.round(s.stars || 0))}
</div>

<div className="text-yellow-400 mt-2">
Preis: € {(s.transferPrice || 0).toLocaleString()}
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

<div className="text-yellow-400">
{"★".repeat(Math.round(c.stars || 0))}
</div>

<div className="text-yellow-400 mt-2">
Preis: € {(c.transferPrice || 0).toLocaleString()}
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

<PlayerModal
player={selectedPlayer}
onClose={()=>setSelectedPlayer(null)}
/>

</div>

);

}