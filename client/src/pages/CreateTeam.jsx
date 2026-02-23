import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTeam() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await fetch("/api/team/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        shortName
      })
    });

    if (res.ok) {
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-black/40 p-8 rounded-xl w-[500px] space-y-6"
      >
        <h2 className="text-2xl font-bold">Team erstellen</h2>

        {/* Name */}
        <input
          type="text"
          maxLength={21}
          required
          placeholder="Teamname (max 21 Zeichen)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
        />

        {/* Kürzel */}
        <input
          type="text"
          maxLength={3}
          required
          placeholder="Kürzel (3 Buchstaben)"
          value={shortName}
          onChange={(e) =>
            setShortName(e.target.value.toUpperCase())
          }
          className="w-full p-3 bg-gray-800 rounded uppercase"
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 py-3 rounded hover:bg-green-500"
        >
          {loading ? "Erstelle..." : "Team erstellen"}
        </button>
      </form>
    </div>
  );
}