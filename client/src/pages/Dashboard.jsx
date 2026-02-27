import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/manager-office.jpg";

export default function Dashboard() {
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [news, setNews] = useState([]);
  const [nextMatches, setNextMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const budget = 12500000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        // 🔹 Eigenes Team laden
        const teamRes = await fetch("/api/team", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!teamRes.ok) {
          navigate("/create-team");
          return;
        }

        const teamData = await teamRes.json();

        if (!teamData || !teamData._id) {
          navigate("/create-team");
          return;
        }

        setTeam(teamData);

        // 🔹 Liga-Tabelle laden
        const leagueRes = await fetch(`/api/league/${teamData.league}`);
        if (leagueRes.ok) {
          const leagueData = await leagueRes.json();
          setLeagueTeams(leagueData);
        }

        // 🔹 Liga-News laden
        const newsRes = await fetch(
          `/api/news/league/${teamData.league}`
        );
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setNews(newsData);
        }

        // 🔹 Nächste 2 Spiele laden
        const matchRes = await fetch(
          `/api/match/team/${teamData._id}`
        );
        if (matchRes.ok) {
          const allMatches = await matchRes.json();

          const upcoming = allMatches
            .filter(m => !m.played)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 2);

          setNextMatches(upcoming);
        }

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

  // 🔹 Tabelle sortieren
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
      />
      <div className="absolute inset-0 bg-black/80" />

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
                      {club.points || 0} P
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
              {news.length === 0 && (
                <div className="opacity-60">
                  Noch keine News vorhanden
                </div>
              )}

              {news.map(n => (
                <div
                  key={n._id}
                  className="bg-black/40 p-4 rounded-lg"
                >
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-sm opacity-80 mt-1">
                    {n.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 📅 Nächste Begegnungen */}
          <div className="col-span-1 bg-black/50 backdrop-blur-md rounded-xl p-5">
            <h2 className="font-bold mb-4">
              Nächste Begegnungen
            </h2>

            <div className="space-y-4">
              {nextMatches.length === 0 && (
                <div className="opacity-60 text-center">
                  Keine kommenden Spiele
                </div>
              )}

              {nextMatches.map(match => {
                const isHome = match.homeTeam._id === team._id;
                const opponent = isHome
                  ? match.awayTeam.name
                  : match.homeTeam.name;

                return (
                  <div
                    key={match._id}
                    className="text-center bg-black/30 p-6 rounded-lg"
                  >
                    <div>
                      {new Date(match.date).toLocaleDateString("de-DE")}
                    </div>

                    <div className="text-2xl font-bold my-3">
                      {team.name}
                    </div>

                    <div>vs</div>

                    <div className="text-2xl font-bold my-3">
                      {opponent}
                    </div>

                    <div className="text-yellow-400">
                      {isHome ? "Heimspiel" : "Auswärtsspiel"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}