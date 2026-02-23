import { useEffect, useState } from "react";

export default function Teammanagement() {

  const [players, setPlayers] = useState([]);
  const [starting, setStarting] = useState([]);
  const [bench, setBench] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/player/my-team", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPlayers(data);
    };

    fetchPlayers();
  }, []);

  const toggleStarting = (id) => {
    if (starting.includes(id)) {
      setStarting(starting.filter(p => p !== id));
    } else if (starting.length < 11) {
      setStarting([...starting, id]);
    }
  };

  const toggleBench = (id) => {
    if (bench.includes(id)) {
      setBench(bench.filter(p => p !== id));
    } else if (bench.length < 7) {
      setBench([...bench, id]);
    }
  };

  const saveLineup = async () => {
    const token = localStorage.getItem("token");

    await fetch("/api/player/set-lineup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        startingIds: starting,
        benchIds: bench
      })
    });

    alert("Aufstellung gespeichert!");
  };

  return (
    <div className="p-8 text-white">

      <h1 className="text-3xl mb-6">Teammanagement</h1>

      <div className="grid grid-cols-3 gap-4">

        {players.map(player => (
          <div
            key={player._id}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <div className="font-bold">
              {player.firstName} {player.lastName}
            </div>

            <div>{player.positions.join(", ")}</div>
            <div>{"⭐".repeat(player.stars * 2)}</div>

            <div className="mt-3 flex gap-2">

              <button
                onClick={() => toggleStarting(player._id)}
                className="bg-green-600 px-2 py-1 rounded text-xs"
              >
                Startelf
              </button>

              <button
                onClick={() => toggleBench(player._id)}
                className="bg-yellow-600 px-2 py-1 rounded text-xs"
              >
                Bank
              </button>

            </div>
          </div>
        ))}

      </div>

      <button
        onClick={saveLineup}
        className="mt-6 bg-blue-600 px-6 py-2 rounded"
      >
        Speichern
      </button>

    </div>
  );
}