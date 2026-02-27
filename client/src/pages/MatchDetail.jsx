import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MatchDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);

  useEffect(() => {
    fetch(`/api/match/${id}`)
      .then(res => res.json())
      .then(data => setMatch(data))
      .catch(() => setMatch(null));
  }, [id]);

  if (!match) {
    return (
      <div className="p-10 text-gray-400">
        Spiel wird geladen...
      </div>
    );
  }

  const {
    homeTeam,
    awayTeam,
    homeGoals,
    awayGoals,
    possession,
    xG,
    stats,
    summary,
    attendance
  } = match;

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">

      {/* ================= HEADER ================= */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 shadow-2xl text-center mb-10">

        <div className="text-2xl font-semibold mb-4">
          {homeTeam?.name} vs {awayTeam?.name}
        </div>

        <div className="text-6xl font-bold mb-4">
          {homeGoals}:{awayGoals}
        </div>

        <div className="text-sm text-gray-300">
          Zuschauer: {attendance?.toLocaleString()}
        </div>

      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div className="bg-white/5 rounded-xl p-6 space-y-4">

          <StatRow 
            label="Ballbesitz"
            home={possession?.home + "%"}
            away={possession?.away + "%"}
          />

          <StatRow 
            label="xG"
            home={xG?.home}
            away={xG?.away}
          />

          <StatRow 
            label="Schüsse"
            home={stats?.shots?.home}
            away={stats?.shots?.away}
          />

          <StatRow 
            label="Ecken"
            home={stats?.corners?.home}
            away={stats?.corners?.away}
          />

          <StatRow 
            label="Freistöße"
            home={stats?.freeKicks?.home}
            away={stats?.freeKicks?.away}
          />

          <StatRow 
            label="Elfmeter"
            home={stats?.penalties?.home}
            away={stats?.penalties?.away}
          />

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white/5 rounded-xl p-6 space-y-4">

          <StatRow 
            label="Gelbe Karten"
            home={stats?.cards?.home?.yellows}
            away={stats?.cards?.away?.yellows}
          />

          <StatRow 
            label="Rote Karten"
            home={stats?.cards?.home?.reds}
            away={stats?.cards?.away?.reds}
          />

        </div>

      </div>

      {/* ================= MATCH REPORT ================= */}
      <div className="mt-10 bg-white/10 rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4">
          Spielbericht
        </h2>

        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {summary}
        </p>

      </div>

    </div>
  );
}

/* ================= HELPER COMPONENT ================= */

function StatRow({ label, home, away }) {
  return (
    <div className="flex justify-between items-center border-b border-white/10 pb-2">
      <span className="w-1/4 text-left font-semibold">
        {home}
      </span>

      <span className="w-1/2 text-center text-gray-400">
        {label}
      </span>

      <span className="w-1/4 text-right font-semibold">
        {away}
      </span>
    </div>
  );
}