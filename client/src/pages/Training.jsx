import { useState, useEffect } from "react";

export default function Training() {

const initialSquad = [
 { id: 1, name: "Neuer", age: 37, rating: 4.5, stamina: 85, focus: "Regeneration" },
 { id: 2, name: "Davies", age: 24, rating: 4, stamina: 90, focus: "Schnelligkeit" },
 { id: 3, name: "Upamecano", age: 26, rating: 4, stamina: 88, focus: "Defensive" },
 { id: 4, name: "Kimmich", age: 29, rating: 5, stamina: 92, focus: "Passspiel" },
 { id: 5, name: "Musiala", age: 22, rating: 5, stamina: 87, focus: "Spielintelligenz" },
 { id: 6, name: "Sané", age: 28, rating: 4, stamina: 80, focus: "Abschluss" },
 { id: 7, name: "Müller", age: 34, rating: 4.5, stamina: 78, focus: "Regeneration" },
];

const [squad, setSquad] = useState(initialSquad);

/* ================= AUTO LOAD ================= */

useEffect(() => {
 const saved = localStorage.getItem("trainingData");
 if (saved) setSquad(JSON.parse(saved));
}, []);

useEffect(() => {
 localStorage.setItem("trainingData", JSON.stringify(squad));
}, [squad]);

/* ================= TRAININGSLOGIK ================= */

function applyTraining() {
 setSquad(prev =>
   prev.map(player => {
     let newStamina = player.stamina;

     if (player.focus === "Regeneration") {
       newStamina += 8;
     } else {
       newStamina -= 5;
     }

     newStamina = Math.max(0, Math.min(100, newStamina));

     return { ...player, stamina: newStamina };
   })
 );
}

/* ================= RENDER ================= */

return (
<div className="min-h-screen bg-gray-900 text-white p-10">
<div className="max-w-5xl mx-auto">

<h2 className="text-2xl font-bold mb-6">Training</h2>

<div className="space-y-4">
{squad.map(player => (
<div
key={player.id}
className="bg-gray-800 p-4 rounded-xl flex justify-between items-center"
>

<div>
<div className="font-semibold text-lg">
{player.name} ({player.age})
</div>
<div className="text-yellow-400">
{renderStars(player.rating)}
</div>
</div>

<div className="w-1/3">
<div className="text-sm mb-1">Ausdauer {player.stamina}%</div>
<div className="w-full bg-gray-700 h-3 rounded">
<div
className="bg-green-500 h-3 rounded"
style={{ width: `${player.stamina}%` }}
></div>
</div>
</div>

<div>
<select
value={player.focus}
onChange={(e) =>
setSquad(prev =>
prev.map(p =>
p.id === player.id
? { ...p, focus: e.target.value }
: p
)
)
}
className="bg-gray-700 p-2 rounded"
>
<option>Abschluss</option>
<option>Passspiel</option>
<option>Defensive</option>
<option>Schnelligkeit</option>
<option>Physis</option>
<option>Spielintelligenz</option>
<option>Regeneration</option>
</select>
</div>

</div>
))}
</div>

<button
onClick={applyTraining}
className="mt-8 px-6 py-3 bg-green-600 rounded-lg hover:bg-green-500"
>
Trainingseinheit durchführen
</button>

</div>
</div>
);
}

/* ================= STERNE ================= */

function renderStars(rating) {
const full = Math.floor(rating);
const hasHalf = rating % 1 !== 0;
const empty = 5 - full - (hasHalf ? 1 : 0);

return (
<span>
{"★".repeat(full)}
{hasHalf && (
<span className="relative inline-block w-[1em]">
<span className="absolute overflow-hidden w-1/2">★</span>
<span className="text-gray-500">★</span>
</span>
)}
{"★".repeat(empty).split("").map((s,i)=>
<span key={i} className="text-gray-600">★</span>
)}
</span>
);
}