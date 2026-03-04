import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTeam() {

const navigate = useNavigate();

const [name, setName] = useState("");
const [shortName, setShortName] = useState("");
const [clubIdentity, setClubIdentity] = useState("love");

const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async (e) => {

e.preventDefault();

setLoading(true);
setError(null);

const token = localStorage.getItem("token");

if (!token) {
navigate("/login");
return;
}

try {

const res = await fetch("/api/team/create", {

method: "POST",

headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},

body: JSON.stringify({
name: name.trim(),
shortName: shortName.trim().toUpperCase(),
clubIdentity
})

});

const data = await res.json();

if (!res.ok) {

setError(data.message || "Fehler beim Erstellen");
setLoading(false);
return;

}

navigate("/", { replace: true });

} catch (err) {

console.error("Create Team Fehler:", err);

setError("Serverfehler");

}

setLoading(false);

};

return (

<div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">

<form
onSubmit={handleSubmit}
className="bg-black/40 p-8 rounded-xl w-[520px] space-y-6"
>

<h2 className="text-2xl font-bold">
Team erstellen
</h2>

{error && (

<div className="bg-red-600/30 border border-red-500 p-3 rounded text-sm">
{error}
</div>

)}

{/* TEAMNAME */}

<input
type="text"
maxLength={21}
required
placeholder="Teamname (max 21 Zeichen)"
value={name}
onChange={(e) => setName(e.target.value)}
className="w-full p-3 bg-gray-800 rounded"
/>

{/* KÜRZEL */}

<input
type="text"
maxLength={3}
required
placeholder="Kürzel (3 Buchstaben)"
value={shortName}
onChange={(e) => setShortName(e.target.value.toUpperCase())}
className="w-full p-3 bg-gray-800 rounded uppercase"
/>

{/* CLUB IDENTITY */}

<div>

<div className="mb-2 font-semibold">
Vereinsimage
</div>

<div className="grid grid-cols-2 gap-4">

<label
className={`p-4 rounded-lg border cursor-pointer transition ${
clubIdentity === "love"
? "border-green-500 bg-green-600/20"
: "border-gray-700 bg-gray-800"
}`}
>

<input
type="radio"
value="love"
checked={clubIdentity === "love"}
onChange={() => setClubIdentity("love")}
className="hidden"
/>

<div className="font-bold mb-1">
❤️ Echte Liebe
</div>

<div className="text-sm text-gray-300">

Mehr Fans<br/>
Größeres Stadion<br/>
Starker Heimvorteil<br/>
Weniger Startbudget

</div>

</label>

<label
className={`p-4 rounded-lg border cursor-pointer transition ${
clubIdentity === "commercial"
? "border-yellow-500 bg-yellow-600/20"
: "border-gray-700 bg-gray-800"
}`}
>

<input
type="radio"
value="commercial"
checked={clubIdentity === "commercial"}
onChange={() => setClubIdentity("commercial")}
className="hidden"
/>

<div className="font-bold mb-1">
💰 Kommerz
</div>

<div className="text-sm text-gray-300">

Mehr Startkapital<br/>
Weniger Fans<br/>
Kleineres Stadion<br/>
Schwächerer Heimvorteil

</div>

</label>

</div>

</div>

<button
disabled={loading}
className="w-full bg-green-600 py-3 rounded hover:bg-green-500 transition"
>

{loading ? "Erstelle..." : "Team erstellen"}

</button>

</form>

</div>

);

}