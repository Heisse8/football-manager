import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-black/80 backdrop-blur-md text-white px-6 py-4 flex justify-between items-center shadow-lg">

      <div className="text-xl font-bold">
        ⚽ Football Manager
      </div>

      <div className="flex space-x-6 items-center">

        <Link to="/" className="hover:text-green-400 transition">
          Dashboard
        </Link>

        <Link to="/team" className="hover:text-green-400 transition">
          Team
        </Link>

        <Link to="/training" className="hover:text-green-400 transition">
          Training
        </Link>

        <Link to="/transfermarkt" className="hover:text-green-400 transition">
          Transfermarkt
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