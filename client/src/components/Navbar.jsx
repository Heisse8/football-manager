
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkStyle =
    "px-4 py-2 rounded hover:bg-white/10 transition";

  const activeStyle =
    "bg-yellow-500 text-black px-4 py-2 rounded font-bold";

  return (
    <div className="bg-black/70 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1600px] mx-auto flex justify-between items-center p-4 text-white">
        
        <div className="text-xl font-bold">
          ⚽ Football Manager
        </div>

        <div className="flex gap-2 text-sm">

          <NavLink to="/" className={({isActive}) => isActive ? activeStyle : linkStyle}>
            Dashboard
          </NavLink>

          <NavLink to="/team" className={({isActive}) => isActive ? activeStyle : linkStyle}>
            Teammanagement
          </NavLink>

          <NavLink to="/training" className={({isActive}) => isActive ? activeStyle : linkStyle}>
            Training
          </NavLink>

          <NavLink to="/transfermarkt" className={({isActive}) => isActive ? activeStyle : linkStyle}>
            Transfermarkt
          </NavLink>

          <NavLink to="/scouting" className={({isActive}) => isActive ? activeStyle : linkStyle}>
            Scouting
          </NavLink>

          <NavLink to="/stadion" className={({isActive}) => isActive ? activeStyle : linkStyle}>
            Stadion
          </NavLink>

          <NavLink to="/finanzen" className={({isActive}) => isActive ? activeStyle : linkStyle}>
            Finanzen
          </NavLink>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}