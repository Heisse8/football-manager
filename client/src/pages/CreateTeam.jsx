import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTeam() {
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState("");
  const [shortName, setShortName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamName || !shortName) {
      setMessage("Bitte alle Felder ausfüllen.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/team/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: teamName,
            shortName: shortName
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Fehler beim Erstellen.");
        setLoading(false);
        return;
      }

      // ✅ Nach Erfolg ins Dashboard
      navigate("/");

    } catch (err) {
      setMessage("Serverfehler.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Team erstellen ⚽
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Teamname"
            className="w-full p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setTeamName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Kurzname (z.B. FCB)"
            className="w-full p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setShortName(e.target.value)}
          />

          <button
            onClick={handleCreateTeam}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 transition p-3 rounded-lg font-semibold"
          >
            {loading ? "Wird erstellt..." : "Team erstellen"}
          </button>

          {message && (
            <div className="text-center text-red-400 text-sm mt-3">
              {message}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}