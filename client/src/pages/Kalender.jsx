import { useEffect, useState } from "react";

export default function Kalender() {
  const [matches, setMatches] = useState([]);
  const [myTeamId, setMyTeamId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  // 🔥 Team + Matches laden
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      // Eigenes Team laden
      const teamRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/team`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const teamData = await teamRes.json();
      setMyTeamId(teamData._id);

      // Matches laden
      const matchRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/match/my-month?year=${year}&month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const matchData = await matchRes.json();
      setMatches(matchData);
    };

    fetchData();
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
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* Monatsnavigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={prevMonth}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          ◀
        </button>

        <h1 className="text-3xl font-bold text-black">
          {currentDate.toLocaleString("de-DE", { month: "long" })} {year}
        </h1>

        <button
          onClick={nextMonth}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          ▶
        </button>
      </div>

      {/* Wochentage */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold text-black">
        {["Mo","Di","Mi","Do","Fr","Sa","So"].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Kalender */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {

          const dayMatches = getMatchesForDay(day);

          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;

          return (
            <div
              key={day}
              className={`bg-white border rounded p-2 min-h-[120px] relative ${
                isToday ? "border-yellow-500 border-2" : "border-gray-300"
              }`}
            >
              {/* Tageszahl */}
              <div className="font-bold text-black mb-2">
                {day}
              </div>

              {dayMatches.map(match => {

                if (!match.homeTeam || !match.awayTeam || !myTeamId) return null;

                const isHome = match.homeTeam._id === myTeamId;

                const opponent = isHome
                  ? match.awayTeam.name
                  : match.homeTeam.name;

                return (
                  <div
                    key={match._id}
                    className="text-xs p-1 mb-1 border rounded bg-gray-50 text-black relative"
                  >
                    {/* Heim / Auswärts Icon */}
                    <div className="absolute top-1 right-1 text-xs">
                      {isHome ? "🏠" : "✈"}
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