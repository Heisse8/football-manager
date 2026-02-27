import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MatchDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);

  useEffect(() => {
    fetch(`https://deine-api-domain/api/match/${id}`)
      .then(res => res.json())
      .then(data => setMatch(data))
      .catch(() => setMatch(null));
  }, [id]);

  if (!match) return <div className="p-10">Lade Spiel...</div>;

  return (
    <div className="p-10 bg-white rounded-xl shadow-xl">

      {/* GROSSES ERGEBNIS */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">
          {match.homeTeam.name} {match.homeGoals}:{match.awayGoals} {match.awayTeam.name}
        </h1>
        <p className="text-gray-500 mt-2">
          xG {match.xG.home} – {match.xG.away}
        </p>
      </div>

      {/* STATISTIKEN */}
      <div className="grid grid-cols-2 gap-6">

        <div>
          <h3 className="font-bold mb-2">Ballbesitz</h3>
          <p>{match.possession.home}% – {match.possession.away}%</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Schüsse</h3>
          <p>{match.stats.shots.home} – {match.stats.shots.away}</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Ecken</h3>
          <p>{match.stats.corners.home} – {match.stats.corners.away}</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Freistöße</h3>
          <p>{match.stats.freeKicks.home} – {match.stats.freeKicks.away}</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Karten</h3>
          <p>
            🟨 {match.stats.cards.home.yellows} – {match.stats.cards.away.yellows}
          </p>
        </div>

      </div>

      {/* SPIELBERICHT */}
      {match.summary && (
        <div className="mt-10">
          <h3 className="font-bold mb-2">Spielbericht</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {match.summary}
          </p>
        </div>
      )}

    </div>
  );
}