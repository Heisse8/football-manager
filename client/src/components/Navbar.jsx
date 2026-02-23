import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [teamName, setTeamName] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setTeamName(null);
          return;
        }

        const res = await fetch("/api/team", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          setTeamName(null);
          return;
        }

        const data = await res.json();
        setTeamName(data?.name || null);
      } catch (err) {
        console.error("Navbar Fehler:", err);
        setTeamName(null);
      }
    };

    fetchTeam();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("clubId");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded transition ${
      isActive
        ? "bg-yellow-500 text-black font-semibold"
        : "hover:bg-gray-700"
    }`;

  return (
    <nav className="bg-black border-b border-gray-800 px-6 py-4 flex justify-between items-center relative">

      {/* 🔥 Teamname links */}
      <div className="text-xl font-bold text-yellow-400">
        {teamName ? teamName : "Kein Team"}
      </div>

      {/* ================= DESKTOP MENÜ ================= */}
      <div className="hidden md:flex items-center gap-4 text-sm">

        <NavLink to="/" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/team" className={linkClass}>Team</NavLink>
        <NavLink to="/kalender" className={linkClass}>Kalender</NavLink>
        <NavLink to="/matchcenter" className={linkClass}>Spieltag</NavLink>
        <NavLink to="/training" className={linkClass}>Training</NavLink>
        <NavLink to="/transfermarkt" className={linkClass}>Transfermarkt</NavLink>
        <NavLink to="/finanzen" className={linkClass}>Finanzen</NavLink>
        <NavLink to="/stadium" className={linkClass}>Stadion</NavLink>

        <button
          onClick={logout}
          className="ml-4 bg-red-600 px-3 py-2 rounded hover:bg-red-500"
        >
          Logout
        </button>
      </div>

      {/* ================= MOBILE BUTTON ================= */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* ================= MOBILE MENÜ ================= */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black border-t border-gray-800 flex flex-col p-4 gap-3 md:hidden z-50">

          <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/team" className={linkClass} onClick={() => setMenuOpen(false)}>Team</NavLink>
          <NavLink to="/kalender" className={linkClass} onClick={() => setMenuOpen(false)}>Kalender</NavLink>
          <NavLink to="/matchcenter" className={linkClass} onClick={() => setMenuOpen(false)}>Spieltag</NavLink>
          <NavLink to="/training" className={linkClass} onClick={() => setMenuOpen(false)}>Training</NavLink>
          <NavLink to="/transfermarkt" className={linkClass} onClick={() => setMenuOpen(false)}>Transfermarkt</NavLink>
          <NavLink to="/finanzen" className={linkClass} onClick={() => setMenuOpen(false)}>Finanzen</NavLink>
          <NavLink to="/stadium" className={linkClass} onClick={() => setMenuOpen(false)}>Stadion</NavLink>

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