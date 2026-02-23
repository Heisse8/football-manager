import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/manager-office.jpg";

export default function Dashboard() {
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const budget = 12500000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        // 🔹 Eigenes Team laden
        const teamRes = await fetch("/api/team", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ❗ Wenn kein Team existiert → direkt weiterleiten
        if (!teamRes.ok) {
          navigate("/create-team");
          return;
        }

        const teamData = await teamRes.json();
        setTeam(teamData);

        // 🔹 Liga laden
        fetch(`/api/league/${teamData.league}`)
          .then((res) => res.json())
          .then((data) => setLeagueTeams(data))
          .catch(() => setLeagueTeams([]));

      } catch (err) {
        console.error("Dashboard Fehler:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-10 text-white animate-pulse">
        Lade Dashboard...
      </div>
    );
  }

  if (!team) return null;

  // 🔥 Sortierung
  const sortedLeague = [...leagueTeams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;

    const diffA = (a.goalsFor || 0) - (a.goalsAgainst || 0);
    const diffB = (b.goalsFor || 0) - (b.goalsAgainst || 0);
    if (diffB !== diffA) return diffB - diffA;

    return a.name.localeCompare(b.name);
  });

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* Hintergrund */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative z-10">

        {/* HEADER */}
        <header className="bg-black/50 backdrop-blur-md p-6 flex justify-between items-center border-b border-white/10">
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <div className="text-xl text-yellow-400 font-semibold">
            💰 {budget.toLocaleString()} €
          </div>
        </header>

        <main className="grid grid-cols-4 gap-6 p-8 max-w-[1800px] mx-auto">

          {/* 🏆 Tabelle */}
          <div className="col-span-1 bg-black/50 backdrop-blur-md rounded-xl p-5">
            <h2 className="font-bold mb-4">
              Tabelle – {team.league}
            </h2>

            <div className="space-y-1 text-sm">
              {sortedLeague.length === 0 && (
                <div className="opacity-60">
                  Noch keine Teams in dieser Liga
                </div>
              )}

              {sortedLeague.map((club, index) => {
                const isMyTeam = club._id === team._id;

                return (
                  <div
                    key={club._id}
                    className={`flex justify-between px-3 py-2 rounded transition ${
                      isMyTeam
                        ? "bg-green-600/30 border-l-4 border-green-400 font-semibold"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <span>
                      {index + 1}. {club.name}
                    </span>
                    <span>
                      {club.points} P
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 📰 News */}
          <div className="col-span-2 bg-black/50 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">
              Manager News
            </h2>

            <div className="space-y-4">
              <div className="bg-black/40 p-4 rounded-lg">
                🔥 Willkommen in {team.league}
              </div>

              <div className="bg-black/40 p-4 rounded-lg">
                Dein Verein ist bereit für die neue Saison.
              </div>

              <div className="bg-black/40 p-4 rounded-lg">
                Transfers & Spieltage folgen bald.
              </div>
            </div>
          </div>

          {/* 📅 Nächste Begegnung */}
          <div className="col-span-1 bg-black/50 backdrop-blur-md rounded-xl p-5">
            <h2 className="font-bold mb-4">
              Nächste Begegnung
            </h2>

            <div className="text-center bg-black/30 p-6 rounded-lg">
              <div>12.03.2026</div>

              <div className="text-2xl font-bold my-3">
                {team.name}
              </div>

              <div>vs</div>

              <div className="text-2xl font-bold my-3">
                Gegner
              </div>

              <div className="text-yellow-400">
                Heimspiel
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}