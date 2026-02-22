import { useEffect, useState } from "react";

export default function Spieltag() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("https://football-manager-z7rr.onrender.com/api/matches/current")
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(() => setMatches([]));
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 border border-white/40">

      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Aktueller Spieltag
      </h2>

      {matches.length === 0 && (
        <p className="text-gray-500 text-sm">
          Keine Spiele vorhanden.
        </p>
      )}

      <div className="space-y-4">
        {matches.map(match => (
          <div
            key={match._id}
            className="flex justify-between items-center bg-white/80 rounded-lg px-6 py-4 shadow-md hover:shadow-lg transition"
          >
            <span className="font-medium">
              {match.homeTeam}
            </span>

            <span className="text-lg font-bold">
              {match.homeGoals}:{match.awayGoals}
            </span>

            <span className="font-medium">
              {match.awayTeam}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}