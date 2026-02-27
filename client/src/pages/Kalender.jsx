import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Kalender() {
  const [matches, setMatches] = useState([]);
  const [myTeamId, setMyTeamId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // 🔥 Eigenes Team laden
        const teamRes = await fetch("/api/team", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!teamRes.ok) return;
        const teamData = await teamRes.json();
        setMyTeamId(teamData._id);

        // 🔥 Matches des Monats laden
        const matchRes = await fetch(
          `/api/match/my-month?year=${year}&month=${month}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!matchRes.ok) return;
        const matchData = await matchRes.json();

        setMatches(Array.isArray(matchData) ? matchData : []);

      } catch (err) {
        console.error("Kalender Fehler:", err);
      }
    };

    fetchData();
  }, [year, month]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const totalCells = startOffset + daysInMonth;
  const rows = Math.ceil(totalCells / 7);
  const totalCalendarCells = rows * 7;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 🔥 WICHTIG: Monat + Jahr prüfen
  const getMatchesForDay = (day) => {
    return matches.filter(match => {
      if (!match.date) return false;

      const d = new Date(match.date);

      return (
        d.getDate() === day &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">

      {/* Monatsnavigation */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={prevMonth}
          className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
        >
          ◀
        </button>

        <h1 className="text-3xl font-bold">
          {currentDate.toLocaleString("de-DE", { month: "long" })} {year}
        </h1>

        <button
          onClick={nextMonth}
          className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
        >
          ▶
        </button>
      </div>

      {/* Wochentage */}
      <div className="grid grid-cols-7 gap-3 mb-3 text-center font-semibold text-gray-400">
        {["Mo","Di","Mi","Do","Fr","Sa","So"].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Kalender Grid */}
      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: totalCalendarCells }, (_, index) => {

          const dayNumber = index - startOffset + 1;

          if (index < startOffset || dayNumber > daysInMonth) {
            return (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-lg min-h-[130px]"
              />
            );
          }

          const dayMatches = getMatchesForDay(dayNumber);

          const isToday =
            today.getDate() === dayNumber &&
            today.getMonth() === month &&
            today.getFullYear() === year;

          return (
            <div
              key={index}
              className={`bg-gray-800 rounded-lg p-3 min-h-[130px] border ${
                isToday
                  ? "border-yellow-400"
                  : "border-gray-700"
              }`}
            >
              <div className="font-bold mb-2 text-sm text-gray-300">
                {dayNumber}
              </div>

              {dayMatches.map(match => {

                if (!match.homeTeam || !match.awayTeam || !myTeamId)
                  return null;

                const isHome = match.homeTeam._id === myTeamId;

                const opponent = isHome
                  ? match.awayTeam.name
                  : match.homeTeam.name;

                return (
                  <div
  key={match._id}
  onClick={() => navigate(`/match/${match._id}`)}
  className="cursor-pointer text-xs p-2 mb-2 rounded bg-gray-900 border border-gray-700 relative hover:bg-gray-700 transition"
>
                    <div className="absolute top-1 right-1 text-xs">
                      {isHome ? "🏠" : "✈"}
                    </div>

                    <div className="font-semibold text-gray-300">
                      {match.competition === "cup"
  ? "Pokal"
  : "Liga"}
                    </div>

                    <div className="text-gray-400">
                      vs {opponent}
                    </div>

                    {match.played && (
                      <div className="mt-1 font-bold text-white">
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