import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

// ===============================
// Feste Positionspunkte (4-3-3 Beispiel)
// ===============================
const positions = [
  { id: "GK", top: "88%", left: "50%" },

  { id: "LB", top: "70%", left: "20%" },
  { id: "LCB", top: "72%", left: "40%" },
  { id: "RCB", top: "72%", left: "60%" },
  { id: "RB", top: "70%", left: "80%" },

  { id: "CM1", top: "55%", left: "35%" },
  { id: "CM2", top: "50%", left: "50%" },
  { id: "CM3", top: "55%", left: "65%" },

  { id: "LW", top: "30%", left: "20%" },
  { id: "ST", top: "25%", left: "50%" },
  { id: "RW", top: "30%", left: "80%" },
];

export default function TeamPage() {
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // DATEN LADEN
  // ===============================
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const [playerRes, teamRes] = await Promise.all([
        fetch("/api/player/my-team", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/team", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const playerData = await playerRes.json();
      const teamData = await teamRes.json();

      setPlayers(playerData || []);
      setLineup(teamData.lineup || {});
      setBench(teamData.bench || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  // ===============================
  // AUTO SAVE
  // ===============================
  useEffect(() => {
    if (loading) return;

    const save = async () => {
      const token = localStorage.getItem("token");

      await fetch("/api/team/lineup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lineup, bench }),
      });
    };

    const timeout = setTimeout(save, 500);
    return () => clearTimeout(timeout);
  }, [lineup, bench, loading]);

  // ===============================
  // DRAG & DROP
  // ===============================
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const playerId = active.id;

    // Position auf Spielfeld
    if (positions.find((p) => p.id === over.id)) {
      setLineup((prev) => ({
        ...prev,
        [over.id]: playerId,
      }));

      setBench((prev) => prev.filter((id) => id !== playerId));
    }

    // Bank
    if (over.id === "bench") {
      setBench((prev) =>
        prev.includes(playerId) ? prev : [...prev, playerId]
      );

      setLineup((prev) => {
        const copy = { ...prev };
        Object.keys(copy).forEach((pos) => {
          if (copy[pos] === playerId) delete copy[pos];
        });
        return copy;
      });
    }
  };

  if (loading) return <div className="p-10">Lade...</div>;

  const benchPlayers = players.filter((p) =>
    bench.includes(p._id)
  );

  const freePlayers = players.filter(
    (p) =>
      !bench.includes(p._id) &&
      !Object.values(lineup).includes(p._id)
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex p-8 gap-10 bg-gray-900 min-h-screen text-white">

        {/* ===============================
            SPIELFELD
        =============================== */}
        <div className="flex flex-col items-center">

          <div className="relative w-[600px] h-[900px] bg-green-700 rounded-xl border-4 border-white overflow-hidden">

            <FieldLines />

            {positions.map((pos) => (
              <FieldSlot
                key={pos.id}
                position={pos}
                player={players.find(
                  (p) => p._id === lineup[pos.id]
                )}
              />
            ))}
          </div>

          {/* ===============================
              BANK UNTER SPIELFELD
          =============================== */}
          <div className="mt-6 w-[600px]">
            <BenchZone>
              {benchPlayers.map((player) => (
                <PlayerCard key={player._id} player={player} />
              ))}
            </BenchZone>
          </div>
        </div>

        {/* ===============================
            RESTLICHER KADER
        =============================== */}
        <div className="w-72">
          <h2 className="text-lg font-bold mb-4">Kader</h2>

          {freePlayers.map((player) => (
            <PlayerCard key={player._id} player={player} />
          ))}
        </div>
      </div>
    </DndContext>
  );
}

// ===============================
// SPIELFELD LINIEN
// ===============================
function FieldLines() {
  return (
    <>
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white"></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 left-1/2 w-80 h-36 border-2 border-white transform -translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/2 w-80 h-36 border-2 border-white transform -translate-x-1/2"></div>
    </>
  );
}

// ===============================
// POSITIONS-SLOT
// ===============================
function FieldSlot({ position, player }) {
  const { setNodeRef, isOver } = useDroppable({ id: position.id });

  return (
    <div
      ref={setNodeRef}
      className={`absolute w-24 h-24 rounded-full flex items-center justify-center text-xs font-bold transition
        ${isOver ? "bg-yellow-400" : "bg-white text-black"}`}
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -50%)",
      }}
    >
      {player ? player.name : position.id}
    </div>
  );
}

// ===============================
// BANK DROPZONE
// ===============================
function BenchZone({ children }) {
  const { setNodeRef } = useDroppable({ id: "bench" });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-800 p-4 rounded-xl min-h-[100px] flex gap-3 flex-wrap"
    >
      {children}
    </div>
  );
}

// ===============================
// SPIELER KARTE
// ===============================
function PlayerCard({ player }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({ id: player._id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-gray-700 p-3 rounded cursor-grab hover:bg-gray-600 transition w-40"
    >
      <div className="font-semibold">{player.name}</div>
      <div className="text-yellow-400 text-sm">
        {"⭐".repeat(Math.round(player.starRating || 3))}
      </div>
      <div className="text-xs text-gray-400">
        {player.primaryPosition}
      </div>
    </div>
  );
}