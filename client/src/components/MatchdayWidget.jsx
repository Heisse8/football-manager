import { useEffect, useState } from "react";

export default function MatchdayWidget() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("https://football-manager-z7rr.onrender.com/api/matches/current")
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(() => setMatches([]));
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/40">
      <h3 className="font-bold mb-4 text-gray-800">Begegnungen</h3>

      {matches.length === 0 && (
        <p className="text-sm text-gray-500">Keine Spiele vorhanden</p>
      )}

      {matches.map(match => (
        <div key={match._id} className="flex justify-between py-2 border-b text-sm">
          <span>{match.homeTeam}</span>
          <span className="font-bold">
            {match.homeGoals}:{match.awayGoals}
          </span>
          <span>{match.awayTeam}</span>
        </div>
      ))}
    </div>
  );
}