import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-black/80 backdrop-blur-md text-white px-8 py-4 flex justify-between items-center shadow-lg">

      {/* LOGO / TITEL LINKS */}
      <div className="text-xl font-bold tracking-wide">
        ⚽ Football Manager
      </div>

      {/* NAVIGATION RECHTS */}
      <div className="flex items-center space-x-6 text-sm font-medium">

        <Link to="/" className="hover:text-green-400 transition">
          Dashboard
        </Link>

        <Link to="/team" className="hover:text-green-400 transition">
          Teammanagement
        </Link>

        <Link to="/kalender" className="hover:text-green-400 transition">
          Kalender
        </Link>

        <Link to="/tabelle" className="hover:text-green-400 transition">
          Tabelle
        </Link>

        <Link to="/training" className="hover:text-green-400 transition">
          Training
        </Link>

        <Link to="/transfermarkt" className="hover:text-green-400 transition">
          Transfermarkt
        </Link>

        <Link to="/finanzen" className="hover:text-green-400 transition">
          Finanzen
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition font-semibold"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}