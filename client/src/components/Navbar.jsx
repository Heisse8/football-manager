import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar(){

const navigate = useNavigate();
const location = useLocation();

const [menuOpen,setMenuOpen] = useState(false);

const [team,setTeam] = useState(null);
const [hasNewMatch,setHasNewMatch] = useState(false);
const [notifications,setNotifications] = useState(0);

/* =====================================================
LOAD DATA
===================================================== */

useEffect(()=>{

const token = localStorage.getItem("token");
if(!token) return;

const loadData = async()=>{

try{

const headers = {
Authorization:`Bearer ${token}`
};

const [teamRes,matchRes,notifRes] = await Promise.all([

fetch("/api/team",{headers}),
fetch("/api/match/has-new",{headers}),
fetch("/api/notifications/count",{headers})

]);

if(teamRes.ok){
const teamData = await teamRes.json();
setTeam(teamData);
}

if(matchRes.ok){
const matchData = await matchRes.json();
setHasNewMatch(matchData.hasNew);
}

if(notifRes.ok){
const notifData = await notifRes.json();
setNotifications(notifData.count);
}

}catch(err){

console.error("Navbar load Fehler:",err);

}

};

loadData();

const interval = setInterval(loadData,60000);

return ()=>clearInterval(interval);

},[]);

/* =====================================================
STOP MATCH PULSE
===================================================== */

useEffect(()=>{

if(location.pathname === "/matchcenter"){
setHasNewMatch(false);
}

},[location.pathname]);

/* =====================================================
LOGOUT
===================================================== */

const logout = ()=>{

localStorage.removeItem("token");
localStorage.removeItem("clubId");

setTeam(null);
setNotifications(0);
setHasNewMatch(false);

navigate("/login");

};

/* =====================================================
FORMAT MONEY
===================================================== */

function formatMoney(value){

if(!value) return "0";

return new Intl.NumberFormat("de-DE").format(value);

}

/* =====================================================
LINK STYLE
===================================================== */

const linkClass = ({isActive}) =>
`px-3 py-2 rounded transition ${
isActive
? "bg-yellow-500 text-black font-semibold"
: "hover:bg-gray-700"
}`;

/* =====================================================
NAV LINKS
===================================================== */

const navLinks = [

{ path:"/", label:"Dashboard" },
{ path:"/team", label:"Team" },
{ path:"/transfermarkt", label:"Transfermarkt" },
{ path:"/kalender", label:"Kalender" },
{ path:"/stadium", label:"Stadion" },
{ path:"/finanzen", label:"Finanzen" }

];

/* =====================================================
RENDER
===================================================== */

return(

<nav className="bg-black border-b border-gray-800 px-6 py-4 flex justify-between items-center relative">

{/* CLUB INFO */}

<div className="flex flex-col">

<div className="text-lg font-bold text-yellow-400">
{team?.name || "Kein Team"}
</div>

<div className="text-xs text-gray-400 flex gap-4">

<span>💰 € {formatMoney(team?.balance)}</span>
<span>👥 Fans: {team?.fanBase || 0}</span>
<span>🏆 {team?.league || "-"}</span>

</div>

</div>

{/* DESKTOP NAV */}

<div className="hidden md:flex items-center gap-4 text-sm">

<NavLink
to="/matchcenter"
className={`px-3 py-2 rounded font-semibold transition ${
hasNewMatch
? "bg-yellow-500 text-black animate-pulse"
: "bg-yellow-500 text-black"
}`}
>
Spieltag
</NavLink>

{navLinks.map(link=>(
<NavLink
key={link.path}
to={link.path}
className={linkClass}
>
{link.label}
</NavLink>
))}

{/* NOTIFICATIONS */}

<div className="relative">

<NavLink
to="/news"
className="px-3 py-2 rounded hover:bg-gray-700"
>
🔔
</NavLink>

{notifications > 0 && (

<span className="absolute -top-1 -right-1 bg-red-600 text-xs px-2 py-0.5 rounded-full">
{notifications}
</span>

)}

</div>

<button
onClick={logout}
className="ml-4 bg-red-600 px-3 py-2 rounded hover:bg-red-500"
>
Logout
</button>

</div>

{/* MOBILE BUTTON */}

<div className="md:hidden">

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="text-white text-2xl"
>
☰
</button>

</div>

{/* MOBILE MENU */}

{menuOpen && (

<div className="absolute top-16 left-0 w-full bg-black border-t border-gray-800 flex flex-col p-4 gap-3 md:hidden z-50">

<NavLink
to="/matchcenter"
className={`px-3 py-2 rounded font-semibold ${
hasNewMatch
? "bg-yellow-500 text-black animate-pulse"
: "bg-yellow-500 text-black"
}`}
onClick={()=>setMenuOpen(false)}
>
Spieltag
</NavLink>

{navLinks.map(link=>(
<NavLink
key={link.path}
to={link.path}
className={linkClass}
onClick={()=>setMenuOpen(false)}
>
{link.label}
</NavLink>
))}

<NavLink
to="/news"
className="px-3 py-2 rounded hover:bg-gray-700"
onClick={()=>setMenuOpen(false)}
>
News {notifications > 0 && `(${notifications})`}
</NavLink>

<button
onClick={logout}
className="bg-red-600 px-3 py-2 rounded hover:bg-red-500 mt-2"
>
Logout
</button>

</div>

)}

</nav>

);

}