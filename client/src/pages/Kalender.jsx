import { useEffect, useState } from "react";

export default function Kalender() {
  const [matches, setMatches] = useState([]);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/match/my-month`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setMatches(data);
    };

    fetchMatches();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getMatchesForDay = (day) => {
    return matches.filter(match => {
      const matchDate = new Date(match.date);
      return matchDate.getDate() === day;
    });
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">
        {currentDate.toLocaleString("de-DE", { month: "long" })} {year}
      </h1>

      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const dayMatches = getMatchesForDay(day);

          return (
            <div
              key={day}
              className="bg-black/50 p-3 rounded-lg min-h-[120px]"
            >
              <div className="font-bold mb-2">{day}</div>

              {dayMatches.map(match => {
                const isHome = match.homeTeam._id === match.homeTeam._id;

                const opponent =
                  match.homeTeam._id === match.homeTeam._id
                    ? match.awayTeam.name
                    : match.homeTeam.name;

                return (
                  <div
                    key={match._id}
                    className={`text-xs p-1 rounded mb-1 ${
                      match.competition === "LEAGUE"
                        ? "bg-blue-600"
                        : "bg-red-600"
                    }`}
                  >
                    {match.competition === "LEAGUE" ? "Liga" : "Pokal"}  
                    {" vs "} {opponent}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}