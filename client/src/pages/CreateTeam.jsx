import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTeam() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [logo, setLogo] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "https://football-manager-z7rr.onrender.com/api/team/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ name, shortName, logo })
      }
    );

    if (res.ok) {
      navigate("/");
    } else {
      alert("Fehler beim Erstellen");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <form onSubmit={handleCreate} className="bg-black/60 p-8 rounded-xl w-96">
        <h2 className="text-2xl mb-6">Team erstellen</h2>

        <input
          placeholder="Teamname"
          className="w-full mb-4 p-2 bg-gray-800 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Kürzel"
          className="w-full mb-4 p-2 bg-gray-800 rounded"
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
        />

        <input
          placeholder="Logo URL"
          className="w-full mb-4 p-2 bg-gray-800 rounded"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
        />

        <button className="w-full bg-green-600 p-2 rounded">
          Team erstellen
        </button>
      </form>
    </div>
  );
}