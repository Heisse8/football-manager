import { useEffect, useState } from "react";
import bgImage from "../assets/manager-office.jpg";

export default function Dashboard() {
  const [teamName, setTeamName] = useState("");
  const [league, setLeague] = useState("");
  const [table, setTable] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      // Eigenes Team laden
      const teamRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/team`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const myTeam = await teamRes.json();

      setTeamName(myTeam.name);
      setLeague(myTeam.league);

      // Liga laden
      const leagueRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/league/${myTeam.league}`
      );

      const leagueTeams = await leagueRes.json();

      setTable(leagueTeams);
    };

    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative z-10 p-8">

        <h1 className="text-3xl font-bold mb-6">
          {teamName} – {league}
        </h1>

        <div className="bg-black/50 rounded-xl p-6 max-w-2xl">

          {table.map((club, index) => {
            const isMyTeam = club.name === teamName;

            return (
              <div
                key={club._id}
                className={`flex justify-between px-4 py-2 rounded mb-1 ${
                  isMyTeam
                    ? "bg-green-600/30 border-l-4 border-green-400 font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                <span>{index + 1}. {club.name}</span>
                <span>{club.points} P</span>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}