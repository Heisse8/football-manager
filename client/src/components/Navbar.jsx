import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-black text-white p-4 flex gap-6 items-center shadow-lg">
      <NavLink to="/" className="hover:text-yellow-400">Dashboard</NavLink>
      <NavLink to="/team" className="hover:text-yellow-400">Teammanagement</NavLink>
      <NavLink to="/training" className="hover:text-yellow-400">Training</NavLink>
      <NavLink to="/transfermarkt" className="hover:text-yellow-400">Transfermarkt</NavLink>
      <NavLink to="/scouting" className="hover:text-yellow-400">Scouting</NavLink>
      <NavLink to="/stadion" className="hover:text-yellow-400">Stadion</NavLink>
      <NavLink to="/finanzen" className="hover:text-yellow-400">Finanzen</NavLink>

      <button
        onClick={handleLogout}
        className="ml-auto bg-red-600 px-3 py-1 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}