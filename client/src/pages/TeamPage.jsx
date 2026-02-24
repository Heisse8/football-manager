import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

export default function TeamPage() {
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // SPIELER + GESPEICHERTES LINEUP LADEN
  // ============================================
  useEffect(() => {
    const fetchData = async () => {
      try {
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
      } catch (err) {
        console.error("Fehler beim Laden:", err);
      }
    };

    fetchData();
  }, []);

  // ============================================
  // AUTOMATISCH SPEICHERN
  // ============================================
  useEffect(() => {
    if (loading) return;

    const save = async () => {
      try {
        const token = localStorage.getItem("token");

        await fetch("/api/team/lineup", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            lineup,
            bench,
          }),
        });
      } catch (err) {
        console.error("Speichern fehlgeschlagen:", err);
      }
    };

    const timeout = setTimeout(save, 500);
    return () => clearTimeout(timeout);
  }, [lineup, bench, loading]);

  // ============================================
  // DRAG & DROP
  // ============================================
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const playerId = active.id;

    if (over.id === "lineup") {
      if (Object.keys(lineup).length >= 11) {
        alert("Maximal 11 Spieler in der Startelf");
        return;
      }

      setLineup((prev) => ({
        ...prev,
        [playerId]: true,
      }));

      setBench((prev) => prev.filter((id) => id !== playerId));
    }

    if (over.id === "bench") {
      setBench((prev) =>
        prev.includes(playerId) ? prev : [...prev, playerId]
      );

      setLineup((prev) => {
        const copy = { ...prev };
        delete copy[playerId];
        return copy;
      });
    }

    if (over.id === "squad") {
      setBench((prev) => prev.filter((id) => id !== playerId));

      setLineup((prev) => {
        const copy = { ...prev };
        delete copy[playerId];
        return copy;
      });
    }
  };

  if (loading) return <div className="p-10">Lade Kader...</div>;

  const startelf = players.filter((p) => lineup[p._id]);
  const bankSpieler = players.filter((p) => bench.includes(p._id));
  const notInSquad = players.filter(
    (p) => !lineup[p._id] && !bench.includes(p._id)
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex p-10 gap-10 bg-gray-900 min-h-screen text-white">
        <DropZone id="lineup" title={`Startelf (${startelf.length}/11)`}>
          {startelf.map((player) => (
            <PlayerCard key={player._id} player={player} />
          ))}
        </DropZone>

        <DropZone id="bench" title="Bank">
          {bankSpieler.map((player) => (
            <PlayerCard key={player._id} player={player} />
          ))}
        </DropZone>

        <DropZone id="squad" title="Nicht im Kader">
          {notInSquad.map((player) => (
            <PlayerCard key={player._id} player={player} />
          ))}
        </DropZone>
      </div>
    </DndContext>
  );
}

// ============================================
// DROPZONE
// ============================================
function DropZone({ id, title, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-80 p-5 rounded-xl transition ${
        isOver ? "bg-yellow-600" : "bg-gray-800"
      }`}
    >
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// ============================================
// SPIELERKARTE
// ============================================
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
      className="bg-gray-700 p-3 rounded cursor-grab hover:bg-gray-600 transition"
    >
      <div className="font-semibold">{player.name}</div>

      <div className="text-xs text-gray-300">
        Alter: {player.age}
      </div>

      <div className="text-yellow-400 text-sm">
        {"⭐".repeat(Math.round(player.starRating || 3))}
      </div>

      <div className="text-xs text-gray-400">
        {player.primaryPosition}
      </div>
    </div>
  );
}