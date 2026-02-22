import { useEffect, useState } from "react";

export default function Heimtabelle() {
  const [table, setTable] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/league/away-table")
      .then(res => res.json())
      .then(data => setTable(data))
      .catch(() => setTable([]));
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 border border-white/40">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Heimtabelle
      </h2>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-600 uppercase text-xs tracking-wide">
          <tr>
            <th className="py-3 text-left w-12">#</th>
            <th className="text-left">Team</th>
            <th className="text-center w-12">Sp</th>
            <th className="text-center w-16">Tore</th>
            <th className="text-center w-16 font-bold">Pkt</th>
          </tr>
        </thead>

        <tbody>
          {table.map((team, index) => (
            <tr key={team.name} className="border-b hover:bg-gray-100/60 transition">
              <td className="py-4 font-bold">{index + 1}.</td>
              <td>{team.name}</td>
              <td className="text-center">{team.games}</td>
              <td className="text-center">
                {team.goalsFor}:{team.goalsAgainst}
              </td>
              <td className="text-center font-bold">
                {team.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}