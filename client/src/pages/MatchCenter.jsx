import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MatchCenter() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const res = await fetch("/api/match/current");
        const data = await res.json();

        // Nur berechnete Spiele
        const playedMatches = data.filter(m => m.played);
        setMatches(playedMatches);

      } catch (err) {
        console.error("Fehler beim Laden der Spiele");
      }
    };

    loadMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">
        Aktueller Spieltag
      </h1>

      {matches.length === 0 && (
        <div className="opacity-60">
          Noch keine berechneten Spiele vorhanden.
        </div>
      )}

      <div className="grid gap-6">
        {matches.map(match => (
          <div
            key={match._id}
            onClick={() =>
              match.played && navigate(`/match/${match._id}`)
            }
            className={`p-6 rounded-xl shadow-lg transition ${
              match.played
                ? "cursor-pointer hover:bg-white/20 bg-white/10"
                : "opacity-40 bg-white/5"
            }`}
          >
            <div className="text-lg font-semibold mb-2">
              {match.homeTeam?.name} vs {match.awayTeam?.name}
            </div>

            {match.played && (
              <div className="text-2xl font-bold">
                {match.homeGoals} : {match.awayGoals}
              </div>
            )}

            {!match.played && (
              <div className="opacity-60">
                Noch nicht gespielt
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}