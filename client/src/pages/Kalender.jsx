import { useEffect, useState } from "react";

export default function Kalender() {
  const [matches, setMatches] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/match/my-month?year=${year}&month=${month}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      setMatches(data);
    };

    fetchMatches();
  }, [year, month]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getMatchesForDay = (day) => {
    return matches.filter(match => {
      const d = new Date(match.date);
      return d.getDate() === day;
    });
  };

  return (
    <div className="p-8 text-white">

      {/* Monatsnavigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={prevMonth}
          className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
        >
          ◀
        </button>

        <h1 className="text-3xl font-bold">
          {currentDate.toLocaleString("de-DE", { month: "long" })} {year}
        </h1>

        <button
          onClick={nextMonth}
          className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
        >
          ▶
        </button>
      </div>

      {/* Wochentage */}
      <div className="grid grid-cols-7 gap-4 mb-2 text-center font-bold opacity-70">
        {["Mo","Di","Mi","Do","Fr","Sa","So"].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Kalender */}
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {

          const dayMatches = getMatchesForDay(day);

          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;

          return (
            <div
              key={day}
              className={`bg-black/50 p-3 rounded-lg min-h-[120px] relative ${
                isToday ? "border-2 border-yellow-400" : ""
              }`}
            >
              {/* Tageszahl */}
              <div className="font-bold mb-2">{day}</div>

              {dayMatches.map(match => {

                const myTeamId =
                  match.homeTeam.owner === undefined
                    ? null
                    : match.homeTeam.owner;

                const isHome =
                  match.homeTeam._id === match.homeTeam._id;

                const opponent =
                  match.homeTeam._id === match.homeTeam._id
                    ? match.awayTeam.name
                    : match.homeTeam.name;

                return (
                  <div
                    key={match._id}
                    className="text-xs p-1 rounded mb-1 bg-gray-800 relative"
                  >
                    {/* Heim/Auswärts Icon */}
                    <div className="absolute top-1 right-1 text-xs">
                      {match.homeTeam._id === match.homeTeam._id
                        ? "🏠"
                        : "✈"}
                    </div>

                    {/* Wettbewerb */}
                    <div className="font-semibold">
                      {match.competition === "LEAGUE" ? "Liga" : "Pokal"}
                    </div>

                    {/* Gegner */}
                    <div>vs {opponent}</div>

                    {/* Ergebnis */}
                    {match.played && (
                      <div className="mt-1 font-bold">
                        {match.homeGoals} : {match.awayGoals}
                      </div>
                    )}
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