import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";

/* =====================================
   FORMATIONEN
===================================== */
const formations = {
  "4-4-2": [
    { id: "GK", top: "88%", left: "50%" },
    { id: "LB", top: "72%", left: "20%" },
    { id: "LCB", top: "72%", left: "40%" },
    { id: "RCB", top: "72%", left: "60%" },
    { id: "RB", top: "72%", left: "80%" },
    { id: "LM", top: "55%", left: "20%" },
    { id: "CM1", top: "55%", left: "45%" },
    { id: "CM2", top: "55%", left: "65%" },
    { id: "RM", top: "55%", left: "85%" },
    { id: "ST1", top: "25%", left: "40%" },
    { id: "ST2", top: "25%", left: "60%" },
  ],
  "4-3-3": [
    { id: "GK", top: "88%", left: "50%" },
    { id: "LB", top: "72%", left: "20%" },
    { id: "LCB", top: "72%", left: "40%" },
    { id: "RCB", top: "72%", left: "60%" },
    { id: "RB", top: "72%", left: "80%" },
    { id: "CM1", top: "55%", left: "35%" },
    { id: "CM2", top: "55%", left: "55%" },
    { id: "CM3", top: "55%", left: "75%" },
    { id: "LW", top: "25%", left: "30%" },
    { id: "ST", top: "20%", left: "50%" },
    { id: "RW", top: "25%", left: "70%" },
  ],
};

/* =====================================
   TEAM PAGE
===================================== */
export default function TeamPage() {
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
  const [formation, setFormation] = useState("4-4-2");

  /* ================= LOAD TEAM ================= */
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/team", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setLineup(data.lineup || {});
      setBench(data.bench || []);
      setFormation(data.formation || "4-4-2");

      // Spieler laden
      const playerRes = await fetch("/api/player/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const playerData = await playerRes.json();
      setPlayers(playerData);
    };

    load();
  }, []);

  /* ================= AUTO SAVE ================= */
  useEffect(() => {
    const save = async () => {
      const token = localStorage.getItem("token");

      await fetch("/api/team/lineup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lineup, bench, formation }),
      });
    };

    save();
  }, [lineup, bench, formation]);

  /* ================= DRAG ================= */
  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (!over) return;

    const playerId = active.id;
    const target = over.id;

    // Entfernen
    setLineup((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((pos) => {
        if (copy[pos] === playerId) delete copy[pos];
      });
      return copy;
    });

    setBench((prev) => prev.filter((id) => id !== playerId));

    // Feld?
    if (formations[formation].find((p) => p.id === target)) {
      if (Object.keys(lineup).length >= 11) return;
      setLineup((prev) => ({ ...prev, [target]: playerId }));
      return;
    }

    // Bank?
    if (target === "bench") {
      if (bench.length >= 7) return;
      setBench((prev) => [...prev, playerId]);
    }
  };

  const startIds = Object.values(lineup);
  const benchIds = bench;

  const notInSquad = players.filter(
    (p) => !startIds.includes(p._id) && !benchIds.includes(p._id)
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black flex justify-center pt-12 gap-16 text-white">

        {/* ===== SPIELFELD ===== */}
        <Field
          formation={formation}
          lineup={lineup}
          players={players}
        />

        {/* ===== RECHTS ===== */}
        <div className="w-96 space-y-6">

          <select
            value={formation}
            onChange={(e) => setFormation(e.target.value)}
            className="bg-gray-800 p-2 rounded w-full"
          >
            {Object.keys(formations).map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          <SquadSection
            title="Startelf"
            players={players.filter((p) =>
              startIds.includes(p._id)
            )}
          />

          <Droppable id="bench">
            <SquadSection
              title="Bank"
              players={players.filter((p) =>
                benchIds.includes(p._id)
              )}
            />
          </Droppable>

          <SquadSection
            title="Nicht im Kader"
            players={notInSquad}
          />
        </div>
      </div>
    </DndContext>
  );
}

/* =====================================
   SPIELFELD
===================================== */
function Field({ formation, lineup, players }) {
  return (
    <div className="relative w-[650px] h-[1000px] bg-green-700 rounded-lg border-4 border-white overflow-hidden">
      {formations[formation].map((pos) => (
        <FieldSlot
          key={pos.id}
          pos={pos}
          player={players.find(
            (p) => p._id === lineup[pos.id]
          )}
        />
      ))}
    </div>
  );
}

function FieldSlot({ pos, player }) {
  const { setNodeRef } = useDroppable({ id: pos.id });

  return (
    <div
      ref={setNodeRef}
      className="absolute w-24 h-24 bg-white rounded-full flex items-center justify-center text-xs font-bold text-black"
      style={{
        top: pos.top,
        left: pos.left,
        transform: "translate(-50%, -50%)",
      }}
    >
      {player ? player.name : pos.id}
    </div>
  );
}

/* =====================================
   KADER
===================================== */
function SquadSection({ title, players }) {
  return (
    <div>
      <h2 className="font-bold border-b border-gray-600 mb-2 pb-1">
        {title}
      </h2>
      <div className="space-y-2">
        {players.map((player) => (
          <PlayerCard key={player._id} player={player} />
        ))}
      </div>
    </div>
  );
}

function Droppable({ id, children }) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
}

/* =====================================
   SPIELER KARTE MIT STERNEN
===================================== */
function PlayerCard({ player }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({ id: player._id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  const stars = Math.round(player.rating);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-gray-800 p-3 rounded hover:bg-gray-700 cursor-grab"
    >
      <div className="font-semibold">{player.name}</div>

      <div className="text-xs text-gray-400">
        {player.age} Jahre
      </div>

      <div className="text-yellow-400 text-sm">
        {"★".repeat(stars)}
        {"☆".repeat(5 - stars)}
      </div>

      <div className="text-xs text-blue-400">
        {player.primaryPosition}
      </div>
    </div>
  );
}