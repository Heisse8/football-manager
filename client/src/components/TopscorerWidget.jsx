import { useEffect, useState } from "react";

export default function TopscorerWidget() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("https://football-manager-z7rr.onrender.com/api/league/topscorers")
      .then(res => res.json())
      .then(data => setPlayers(data.slice(0, 6)))
      .catch(() => setPlayers([]));
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/40">
      <h3 className="font-bold mb-4 text-gray-800">Torjäger</h3>

      {players.length === 0 && (
        <p className="text-sm text-gray-500">Noch keine Tore</p>
      )}

      {players.map((p, index) => (
        <div key={index} className="flex justify-between py-2 border-b text-sm">
          <span>{index + 1}. {p.name}</span>
          <span className="font-bold text-blue-600">
            {p.goals}
          </span>
        </div>
      ))}
    </div>
  );
}