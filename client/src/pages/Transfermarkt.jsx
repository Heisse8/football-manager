import { useEffect,useState } from "react";

export default function Transfermarkt(){

const [players,setPlayers] = useState([]);

useEffect(()=>{

loadMarket();

},[]);

const loadMarket = async ()=>{

try{

const res = await fetch("/api/transfer/player");

const data = await res.json();

setPlayers(data);

}catch(err){

console.error(err);

}

};

/* =====================================================
GEBOT
===================================================== */

const placeBid = async (transfer)=>{

const token = localStorage.getItem("token");

const amount = prompt("Gebot eingeben");

if(!amount) return;

await fetch("/api/transfer/bid",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
transferId:transfer._id,
amount:Number(amount)
})

});

loadMarket();

};

/* =====================================================
TIMER
===================================================== */

function getRemainingTime(date){

const end = new Date(date);
const now = new Date();

const diff = end - now;

if(diff <= 0) return "Beendet";

const hours = Math.floor(diff / 1000 / 60 / 60);
const minutes = Math.floor((diff / 1000 / 60) % 60);

return `${hours}h ${minutes}m`;

}

return(

<div className="max-w-[1200px] mx-auto p-8 text-white">

<h1 className="text-3xl font-bold mb-6">
💸 Transfermarkt
</h1>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

{players.map((t)=>(

<div key={t._id} className="bg-black/50 p-5 rounded-xl">

<div className="font-semibold text-lg">

{t.item.firstName} {t.item.lastName}

</div>

<div className="text-sm text-gray-400">

Position: {t.item.positions?.join(", ")}

</div>

<div className="text-sm">

⭐ {t.item.stars}
</div>

<div className="text-yellow-400 mt-2">

Aktuelles Gebot: € {t.currentBid.toLocaleString()}

</div>

<div className="text-xs text-gray-400 mt-1">

Ende in: {getRemainingTime(t.expiresAt)}

</div>

<button
onClick={()=>placeBid(t)}
className="bg-green-600 hover:bg-green-500 mt-4 px-3 py-2 rounded w-full"
>
Gebot abgeben
</button>

</div>

))}

</div>

</div>

);

}