import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Kalender() {

const [matches, setMatches] = useState([]);
const [myTeamId, setMyTeamId] = useState(null);
const [currentDate, setCurrentDate] = useState(new Date());
const [loading, setLoading] = useState(true);

const navigate = useNavigate();

const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const today = new Date();

/* =====================================================
DATA LOAD
===================================================== */

useEffect(() => {

const fetchData = async () => {

try {

const token = localStorage.getItem("token");

if (!token) {
navigate("/login");
return;
}

/* TEAM + MATCHES PARALLEL LADEN */

const [teamRes, matchRes] = await Promise.all([

fetch("/api/team",{
headers:{ Authorization:`Bearer ${token}` }
}),

fetch(`/api/match/my-month?year=${year}&month=${month}`,{
headers:{ Authorization:`Bearer ${token}` }
})

]);

if(teamRes.ok){

const teamData = await teamRes.json();
setMyTeamId(teamData?._id);

}

if(matchRes.ok){

const matchData = await matchRes.json();
if(Array.isArray(matchData) && teamData?._id){

const filtered = matchData.filter(m =>
m.homeTeam?._id === teamData._id ||
m.awayTeam?._id === teamData._id
);

setMatches(filtered);

}else{

setMatches([]);

}


}

}catch(err){

console.error("Kalender Fehler:", err);

}

setLoading(false);

};

fetchData();

},[year,month,navigate]);

/* =====================================================
CALENDAR CALCULATION
===================================================== */

const daysInMonth = new Date(year, month + 1, 0).getDate();

const firstDay = new Date(year, month, 1).getDay();
const startOffset = firstDay === 0 ? 6 : firstDay - 1;

const totalCells = startOffset + daysInMonth;
const rows = Math.ceil(totalCells / 7);
const totalCalendarCells = rows * 7;

/* =====================================================
MONTH NAVIGATION
===================================================== */

const prevMonth = () => {
setCurrentDate(new Date(year, month - 1, 1));
};

const nextMonth = () => {
setCurrentDate(new Date(year, month + 1, 1));
};

/* =====================================================
MATCH FILTER
===================================================== */

const getMatchesForDay = (day) => {

return matches.filter(match => {

if(!match.date) return false;

const d = new Date(match.date);

return(
d.getDate() === day &&
d.getMonth() === month &&
d.getFullYear() === year
);

});

};

/* =====================================================
LOADING
===================================================== */

if(loading){

return(
<div className="flex items-center justify-center h-screen text-white">
Kalender lädt...
</div>
);

}

/* =====================================================
RENDER
===================================================== */

return(

<div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">

{/* ================= MONAT NAVIGATION ================= */}

<div className="flex justify-between items-center mb-8">

<button
onClick={prevMonth}
className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 hover:scale-[1.02] transition"
>
◀
</button>

<h1 className="text-3xl font-bold">

{currentDate.toLocaleString("de-DE",{ month:"long" })} {year}

</h1>

<button
onClick={nextMonth}
className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
>
▶
</button>

</div>

{/* ================= WEEKDAYS ================= */}

<div className="grid grid-cols-7 gap-3 mb-3 text-center font-semibold text-gray-400">

{["Mo","Di","Mi","Do","Fr","Sa","So"].map(day => (

<div key={day}>{day}</div>

))}

</div>

{/* ================= CALENDAR GRID ================= */}

<div className="grid grid-cols-7 gap-3">

{Array.from({ length: totalCalendarCells }, (_, index) => {

const dayNumber = index - startOffset + 1;

/* EMPTY CELLS */

if(index < startOffset || dayNumber > daysInMonth){

return(

<div
key={index}
className="bg-gray-900 border border-gray-800 rounded-lg min-h-[130px]"
/>

);

}

const dayMatches = getMatchesForDay(dayNumber);

/* TODAY */

const isToday =

today.getDate() === dayNumber &&
today.getMonth() === month &&
today.getFullYear() === year;

return(

<div
key={index}
className={`bg-gray-800 rounded-lg p-3 min-h-[130px] border ${
isToday ? "border-yellow-400" : "border-gray-700"
}`}
>

<div className="font-bold mb-2 text-sm text-gray-300">
{dayNumber}
</div>

{/* MATCHES */}

{dayMatches.map(match => {

if(!match.homeTeam || !match.awayTeam || !myTeamId)
return null;

const isHome = match.homeTeam?._id === myTeamId;

const opponent = isHome
? match.awayTeam?.name
: match.homeTeam?.name;

return(

<div
key={match._id}
onClick={() => navigate(`/match/${match._id}`)}
className="cursor-pointer text-xs p-2 mb-2 rounded bg-gray-900 border border-gray-700 relative hover:bg-gray-700 transition"
>

<div className="absolute top-1 right-1 text-xs">
{isHome ? "🏠" : "✈"}
</div>

<div className="font-semibold text-gray-300">

<div className="font-semibold text-gray-300">

{match.competition === "cup" && "Pokal"}

{match.competition === "league" && "Liga"}

{match.competition === "champions_league" && "CL"}

</div>


</div>

<div className="text-gray-400">
vs {opponent}
</div>

<div className="text-xs text-gray-500">

{new Date(match.date).toLocaleTimeString("de-DE",{
hour:"2-digit",
minute:"2-digit"
})}

</div>


{match.played && (

<div className="mt-1 font-bold text-white">
{match.homeGoals} : {match.awayGoals}
</div>

)}

</div>

);

})}

</div>

);

})}

</div>

</div>

);

}