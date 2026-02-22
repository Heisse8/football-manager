import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass =
    "px-4 py-2 rounded-lg transition font-semibold";

  const activeClass =
    "bg-green-600 text-white";

  const inactiveClass =
    "bg-black/40 text-gray-300 hover:bg-black/70";

  return (
    <nav className="bg-black/60 backdrop-blur-md p-4 flex gap-4 justify-center shadow-lg">

      <NavLink
        to="/"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Startseite
      </NavLink>

      <NavLink
        to="/teammanagement"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Teammanagement
      </NavLink>

      <NavLink
        to="/training"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Training
      </NavLink>

      <NavLink
        to="/transfermarkt"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Transfermarkt
      </NavLink>

      <NavLink
        to="/scouting"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Scouting
      </NavLink>

      <NavLink
        to="/stadion"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Stadion
      </NavLink>

      <NavLink
        to="/sponsoren"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Sponsoren
      </NavLink>

    </nav>
  );
}