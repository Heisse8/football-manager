import {
RadarChart,
PolarGrid,
PolarAngleAxis,
Radar,
ResponsiveContainer,
LineChart,
Line,
XAxis,
YAxis,
Tooltip
} from "recharts";

export default function PlayerModal({ player, onClose }){

if(!player) return null;

/* =====================================================
RADAR STATS
===================================================== */

const radarData = [

{ stat:"Tempo", value:player.pace || 50 },
{ stat:"Schuss", value:player.shooting || 50 },
{ stat:"Pass", value:player.passing || 50 },
{ stat:"Dribbling", value:player.dribbling || 50 },
{ stat:"Def", value:player.defending || 50 },
{ stat:"Physis", value:player.physical || 50 }

];

/* =====================================================
MARKET VALUE HISTORY
===================================================== */

const marketHistory = player.marketHistory || [
{ date:"Jan", value:2000000 },
{ date:"Feb", value:2300000 },
{ date:"Mar", value:2500000 },
{ date:"Apr", value:2700000 },
{ date:"May", value:3000000 }
];

/* =====================================================
LAST MATCH FORM
===================================================== */

const form = player.lastMatches || [
{ match:"1", rating:7.2 },
{ match:"2", rating:6.8 },
{ match:"3", rating:8.1 },
{ match:"4", rating:7.5 },
{ match:"5", rating:7.9 }
];

/* =====================================================
FORMAT MONEY
===================================================== */

function formatMoney(value){
return new Intl.NumberFormat("de-DE").format(value || 0);
}

/* =====================================================
ROLE DETECTION
===================================================== */

function detectRole(){

if(player.positions?.includes("ST")){
return "Poacher";
}

if(player.positions?.includes("CAM")){
return "Playmaker";
}

if(player.positions?.includes("CDM")){
return "Ball Winner";
}

if(player.positions?.includes("CB")){
return "Defender";
}

return "Allrounder";

}

/* =====================================================
RENDER
===================================================== */

return(

<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

<div className="bg-gray-900 w-[1000px] p-8 rounded-xl relative">

<button
onClick={onClose}
className="absolute top-4 right-4 text-xl"
>
✕
</button>

{/* HEADER */}

<div className="flex justify-between mb-6">

<div>

<h2 className="text-2xl font-bold">
{player.firstName} {player.lastName}
</h2>

<p className="text-gray-400">
{player.positions?.join(", ")} • {player.age} Jahre
</p>

<p className="text-yellow-400">
Rolle: {detectRole()}
</p>

</div>

<div className="text-right">

<p className="text-yellow-400 text-lg font-semibold">
{"★".repeat(player.stars || 1)}
</p>

<p className="text-sm text-gray-400">
Marktwert
</p>

<p>
€ {formatMoney(player.marketValue)}
</p>

</div>

</div>

<div className="grid grid-cols-2 gap-10">

{/* RADAR */}

<div className="h-[300px]">

<h3 className="font-semibold mb-2">
Spielerattribute
</h3>

<ResponsiveContainer width="100%" height="100%">

<RadarChart data={radarData}>

<PolarGrid />

<PolarAngleAxis dataKey="stat"/>

<Radar
dataKey="value"
stroke="#facc15"
fill="#facc15"
fillOpacity={0.6}
/>

</RadarChart>

</ResponsiveContainer>

</div>

{/* STATS */}

<div>

<h3 className="font-semibold mb-2">
Karrierestatistik
</h3>

<div className="space-y-2 text-sm">

<div className="flex justify-between">
<span>Spiele</span>
<span>{player.stats?.games || 0}</span>
</div>

<div className="flex justify-between">
<span>Tore</span>
<span>{player.stats?.goals || 0}</span>
</div>

<div className="flex justify-between">
<span>Assists</span>
<span>{player.stats?.assists || 0}</span>
</div>

<div className="flex justify-between">
<span>Gelbe Karten</span>
<span>{player.stats?.yellow || 0}</span>
</div>

<div className="flex justify-between">
<span>Rote Karten</span>
<span>{player.stats?.red || 0}</span>
</div>

</div>

<hr className="my-4 border-gray-700"/>

<h3 className="font-semibold mb-2">
Verletzungen
</h3>

{player.injuries?.length ? (

player.injuries.map((inj,i)=>(

<div key={i} className="text-sm text-gray-400">
{inj.date} – {inj.type}
</div>

))

):(

<div className="text-sm text-gray-500">
Keine Verletzungen
</div>

)}

</div>

</div>

{/* MARKET VALUE GRAPH */}

<div className="mt-8">

<h3 className="font-semibold mb-2">
Marktwertentwicklung
</h3>

<div className="h-[200px]">

<ResponsiveContainer width="100%" height="100%">

<LineChart data={marketHistory}>

<XAxis dataKey="date"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="value"
stroke="#facc15"
strokeWidth={2}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

{/* FORM */}

<div className="mt-6">

<h3 className="font-semibold mb-2">
Form (letzte Spiele)
</h3>

<div className="flex gap-3">

{form.map((f,i)=>(

<div
key={i}
className="bg-gray-800 px-3 py-2 rounded text-center"
>

<div className="text-xs text-gray-400">
#{f.match}
</div>

<div className={`font-semibold ${
f.rating >= 7
? "text-green-400"
: "text-yellow-400"
}`}>
{f.rating}
</div>

</div>

))}

</div>

</div>

</div>

</div>

);

}