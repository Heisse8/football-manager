import { useEffect, useState } from "react";

export default function Tabelle() {
  const [table, setTable] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/league/table")
      .then(res => res.json())
      .then(data => setTable(data))
      .catch(() => setTable([]));
  }, []);

  const getMovement = (team) => {
    if (!team.previousPosition) return "➖";
    if (team.position < team.previousPosition) return "🟢🔺";
    if (team.position > team.previousPosition) return "🔴🔻";
    return "➖";
  };

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 border border-white/40">
      
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Liga Tabelle
      </h2>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-600 uppercase text-xs tracking-wide">
          <tr>
            <th className="py-3 text-left w-12">#</th>
            <th className="w-10"></th>
            <th className="text-left">Team</th>
            <th className="text-center w-12">Sp</th>
            <th className="text-center w-12">S</th>
            <th className="text-center w-12">U</th>
            <th className="text-center w-12">N</th>
            <th className="text-center w-20">Tore</th>
            <th className="text-center w-16">Diff</th>
            <th className="text-center w-16 font-bold">Pkt</th>
          </tr>
        </thead>

        <tbody className="tabular-nums">
          {table.map((team) => (
            <tr
              key={team.name}
              className="border-b hover:bg-gray-100/60 transition align-middle"
            >
              {/* Platz */}
              <td className="py-4 font-bold">
                {team.position}.
              </td>

              {/* Bewegung */}
              <td>
                {getMovement(team)}
              </td>

              {/* Team + Logo */}
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <span className="font-medium leading-none translate-y-[1px]">
                    {team.name}
                  </span>
                </div>
              </td>

              {/* Spiele */}
              <td className="text-center py-4">
                {team.games}
              </td>

              {/* Siege */}
              <td className="text-center py-4">
                {team.wins}
              </td>

              {/* Unentschieden */}
              <td className="text-center py-4">
                {team.draws}
              </td>

              {/* Niederlagen */}
              <td className="text-center py-4">
                {team.losses}
              </td>

              {/* Tore */}
              <td className="text-center py-4">
                {team.goalsFor}:{team.goalsAgainst}
              </td>

              {/* Differenz */}
              <td className="text-center py-4">
                {team.diff > 0 ? `+${team.diff}` : team.diff}
              </td>

              {/* Punkte */}
              <td className="text-center py-4 font-bold text-gray-900">
                {team.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {table.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Noch keine Daten vorhanden.
        </p>
      )}
    </div>
  );
}