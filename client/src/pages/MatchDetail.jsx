import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MatchDetail() {
  const { id } = useParams();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMatch = async () => {
      try {
        const res = await fetch(`/api/match/${id}`);
        if (!res.ok) throw new Error("Match konnte nicht geladen werden");

        const data = await res.json();
        setMatch(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMatch();
  }, [id]);

  if (loading)
    return (
      <div className="text-center text-white mt-20">
        Spiel wird geladen...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-20">
        {error}
      </div>
    );

  if (!match)
    return (
      <div className="text-center text-white mt-20">
        Kein Spiel gefunden
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">

      {/* ================= HEADER ================= */}

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">
          {match.homeTeam?.name} {match.homeGoals} : {match.awayGoals} {match.awayTeam?.name}
        </h1>

        <p className="text-gray-400 mt-2">
          Zuschauer: {match.attendance?.toLocaleString() || 0}
        </p>
      </div>

      {/* ================= POSSESSION ================= */}

      <div className="bg-black/40 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Ballbesitz</h2>
        <div className="flex justify-between text-lg">
          <span>{match.possession?.home || 0}%</span>
          <span>{match.possession?.away || 0}%</span>
        </div>
      </div>

      {/* ================= xG ================= */}

      <div className="bg-black/40 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Expected Goals (xG)</h2>
        <div className="flex justify-between text-lg">
          <span>{match.xG?.home?.toFixed(2) || "0.00"}</span>
          <span>{match.xG?.away?.toFixed(2) || "0.00"}</span>
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="bg-black/40 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Statistik</h2>

        <StatRow
          label="Schüsse"
          home={match.stats?.shots?.home}
          away={match.stats?.shots?.away}
        />

        <StatRow
          label="Ecken"
          home={match.stats?.corners?.home}
          away={match.stats?.corners?.away}
        />

        <StatRow
          label="Freistöße"
          home={match.stats?.freeKicks?.home}
          away={match.stats?.freeKicks?.away}
        />

        <StatRow
          label="Elfmeter"
          home={match.stats?.penalties?.home}
          away={match.stats?.penalties?.away}
        />

        <StatRow
          label="Gelbe Karten"
          home={match.stats?.cards?.home?.yellows}
          away={match.stats?.cards?.away?.yellows}
        />

        <StatRow
          label="Rote Karten"
          home={match.stats?.cards?.home?.reds}
          away={match.stats?.cards?.away?.reds}
        />
      </div>

      {/* ================= MATCH REPORT ================= */}

      {match.summary && (
        <div className="bg-black/40 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Spielbericht</h2>
          <p className="text-gray-300 leading-relaxed">
            {match.summary}
          </p>
        </div>
      )}
    </div>
  );
}

/* ================= STAT ROW COMPONENT ================= */

function StatRow({ label, home, away }) {
  return (
    <div className="flex justify-between py-2 border-b border-white/10">
      <span className="w-1/4 text-left">{home ?? 0}</span>
      <span className="w-1/2 text-center text-gray-300">{label}</span>
      <span className="w-1/4 text-right">{away ?? 0}</span>
    </div>
  );
}