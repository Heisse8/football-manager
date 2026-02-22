import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTeam() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [league, setLeague] = useState("Bundesliga");
  const [country, setCountry] = useState("Deutschland");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateTeam = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/team/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          shortName,
          league,
          country
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Fehler beim Erstellen des Teams");
        setLoading(false);
        return;
      }

      setMessage("Team erfolgreich erstellt ⚽");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setMessage("Serverfehler");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/stadium.jpg')" }}
    >
      <div className="bg-black/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center mb-6">
          Team erstellen ⚽
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Teamname"
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Kürzel (z.B. FCB)"
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setShortName(e.target.value)}
          />

          <select
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800"
          >
            <option>Bundesliga</option>
            <option>2. Bundesliga</option>
            <option>Premier League</option>
            <option>La Liga</option>
          </select>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800"
          >
            <option>Deutschland</option>
            <option>England</option>
            <option>Spanien</option>
            <option>Italien</option>
          </select>

          <button
            onClick={handleCreateTeam}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 transition p-3 rounded-lg font-semibold flex justify-center items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Team erstellen"
            )}
          </button>

          {message && (
            <div className="text-center text-sm mt-3 text-yellow-400">
              {message}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}