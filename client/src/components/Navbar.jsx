import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {

const navigate = useNavigate();
const location = useLocation();

const [menuOpen, setMenuOpen] = useState(false);

const [team, setTeam] = useState(null);
const [hasNewMatch, setHasNewMatch] = useState(false);

const [notifications, setNotifications] = useState(0);

/* =====================================================
TEAM LADEN
===================================================== */

useEffect(() => {

const fetchTeam = async () => {

try {

const token = localStorage.getItem("token");

if (!token) return;

const res = await fetch("/api/team", {
headers: { Authorization: `Bearer ${token}` }
});

if (!res.ok) return;

const data = await res.json();

setTeam(data);

} catch {}

};

fetchTeam();

}, []);

/* =====================================================
MATCH CHECK
===================================================== */

useEffect(() => {

const checkMatch = async () => {

try {

const token = localStorage.getItem("token");

const res = await fetch("/api/match/has-new", {
headers: { Authorization: `Bearer ${token}` }
});

if (!res.ok) return;

const data = await res.json();

setHasNewMatch(data.hasNew);

} catch {}

};

checkMatch();

const interval = setInterval(checkMatch, 60000);

return () => clearInterval(interval);

}, []);

/* =====================================================
STOP MATCH PULSE
===================================================== */

useEffect(() => {

if (location.pathname === "/matchcenter") {
setHasNewMatch(false);
}

}, [location.pathname]);

/* =====================================================
NOTIFICATIONS CHECK
===================================================== */

useEffect(() => {

const checkNotifications = async () => {

try {

const token = localStorage.getItem("token");

const res = await fetch("/api/notifications/count", {
headers: { Authorization: `Bearer ${token}` }
});

if (!res.ok) return;

const data = await res.json();

setNotifications(data.count);

} catch {}

};

checkNotifications();

const interval = setInterval(checkNotifications, 60000);

return () => clearInterval(interval);

}, []);

/* =====================================================
LOGOUT
===================================================== */

const logout = () => {

localStorage.removeItem("token");
localStorage.removeItem("clubId");

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

const linkClass = ({ isActive }) =>
`px-3 py-2 rounded transition ${
isActive
? "bg-yellow-500 text-black font-semibold"
: "hover:bg-gray-700"
}`;

/* =====================================================
NAV LINKS
===================================================== */

const navLinks = [

{ path: "/", label: "Dashboard" },
{ path: "/team", label: "Team" },
{ path: "/kalender", label: "Kalender" },
{ path: "/training", label: "Training" },
{ path: "/transfermarkt", label: "Transfermarkt" },
{ path: "/finanzen", label: "Finanzen" },
{ path: "/stadium", label: "Stadion" }

];

/* =====================================================
RENDER
===================================================== */

return (

<nav className="bg-black border-b border-gray-800 px-6 py-4 flex justify-between items-center relative">

{/* CLUB INFO */}

<div className="flex flex-col">

<div className="text-lg font-bold text-yellow-400">
{team?.name || "Kein Team"}
</div>

<div className="text-xs text-gray-400 flex gap-4">

<span>💰 € {formatMoney(team?.balance)}</span>

<span>👥 Fans: {team?.fanBase || 0}</span>

<span>🏆 {team?.league}</span>

</div>

</div>

{/* DESKTOP NAV */}

<div className="hidden md:flex items-center gap-4 text-sm">

{/* MATCHCENTER */}

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

{navLinks.map(link => (

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
onClick={() => setMenuOpen(!menuOpen)}
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
onClick={() => setMenuOpen(false)}
>
Spieltag
</NavLink>

{navLinks.map(link => (

<NavLink
key={link.path}
to={link.path}
className={linkClass}
onClick={() => setMenuOpen(false)}
>
{link.label}
</NavLink>

))}

<NavLink
to="/news"
className="px-3 py-2 rounded hover:bg-gray-700"
onClick={() => setMenuOpen(false)}
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