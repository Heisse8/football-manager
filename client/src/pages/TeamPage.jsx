import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

/* ================================
   SLOT KOORDINATEN
================================ */

const fieldSlots = {
  GK: { x: 50, y: 92 },
  LB: { x: 20, y: 75 },
  LCB: { x: 38, y: 80 },
  RCB: { x: 62, y: 80 },
  RB: { x: 80, y: 75 },
  DM: { x: 50, y: 65 },
  LCM: { x: 35, y: 55 },
  RCM: { x: 65, y: 55 },
  LW: { x: 20, y: 35 },
  ST: { x: 50, y: 25 },
  RW: { x: 80, y: 35 }
};

export default function TeamPage() {

  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
  const [tactics, setTactics] = useState({});
  const [locked, setLocked] = useState(false);

  /* ================= LOAD ================= */

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");

      const teamRes = await fetch("/api/team", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!teamRes.ok) return;

      const teamData = await teamRes.json();
      setTeam(teamData);
      setLineup(teamData.lineup || {});
      setBench(teamData.bench || []);
      setTactics(teamData.tactics || {});
      setLocked(teamData.lineupLocked);

      const playersRes = await fetch("/api/player/my-team", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const playersData = await playersRes.json();
      setPlayers(playersData);
    };

    load();
  }, []);

  /* ================= AUTO SAVE ================= */

  useEffect(() => {
    if (!team || locked) return;

    const save = async () => {
      const token = localStorage.getItem("token");

      await fetch("/api/team/lineup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          lineup,
          bench,
          tactics
        })
      });
    };

    save();
  }, [lineup, bench, tactics]);

  /* ================= DRAG ================= */

  const handleDragEnd = (event) => {
    if (locked) return;

    const { over, active } = event;
    if (!over) return;

    const playerId = active.id;
    const slot = over.id;

    if (slot === "bench") {
      setBench(prev => [...new Set([...prev, playerId])]);
      setLineup(prev => {
        const copy = { ...prev };
        delete copy[playerId];
        return copy;
      });
      return;
    }

    setLineup(prev => ({
      ...prev,
      [playerId]: {
        position: slot,
        x: fieldSlots[slot].x,
        y: fieldSlots[slot].y
      }
    }));

    setBench(prev => prev.filter(id => id !== playerId));
  };

  if (!team) return null;

  /* ================= FILTER ================= */

  const startIds = Object.keys(lineup);
  const benchIds = bench;

  const startPlayers = players.filter(p => startIds.includes(p._id));
  const benchPlayers = players.filter(p => benchIds.includes(p._id));
  const squadPlayers = players.filter(
    p => !startIds.includes(p._id) && !benchIds.includes(p._id)
  );

  /* ================= RENDER ================= */

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/lockerroom.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

        <div className="relative z-10 p-8 text-white">

          {locked && (
            <div className="bg-red-600 p-3 rounded mb-4">
              🔒 Lineup für diesen Spieltag gesperrt
            </div>
          )}

          {/* ================= MANAGER SETTINGS ================= */}

          <div className="bg-black/50 p-4 rounded-xl mb-6 grid grid-cols-4 gap-4">
            <Select
              label="Spieltempo"
              value={tactics.tempo}
              onChange={(v) => setTactics({ ...tactics, tempo: v })}
              options={["langsam", "normal", "hoch", "sehr_hoch"]}
            />
            <Select
              label="Mentalität"
              value={tactics.mentality}
              onChange={(v) => setTactics({ ...tactics, mentality: v })}
              options={["defensiv", "ausgewogen", "offensiv", "sehr_offensiv"]}
            />
            <Select
              label="Passspiel"
              value={tactics.passing}
              onChange={(v) => setTactics({ ...tactics, passing: v })}
              options={["kurz", "variabel", "lang"]}
            />
            <Select
              label="Abwehrlinie"
              value={tactics.defensiveLine}
              onChange={(v) => setTactics({ ...tactics, defensiveLine: v })}
              options={["tief", "normal", "hoch"]}
            />
          </div>

          <div className="flex gap-10">

            {/* ================= SPIELFELD ================= */}

            <div>
              <div className="relative w-[700px] h-[900px] bg-green-700/90 rounded-xl overflow-hidden shadow-2xl">

                {/* Linien */}
                <div className="absolute inset-0 border-4 border-white"></div>
                <div className="absolute top-1/2 w-full h-[2px] bg-white"></div>
                <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

                {/* 16er */}
                <div className="absolute bottom-0 left-1/2 w-80 h-40 border-2 border-white transform -translate-x-1/2"></div>
                <div className="absolute top-0 left-1/2 w-80 h-40 border-2 border-white transform -translate-x-1/2"></div>

                {/* Slots */}
                {Object.entries(fieldSlots).map(([pos, coords]) => (
                  <FieldSlot key={pos} id={pos} x={coords.x} y={coords.y} />
                ))}

                {/* Spieler */}
                {startPlayers.map(player => {
                  const data = lineup[player._id];
                  return (
                    <div
                      key={player._id}
                      className="absolute bg-white text-black px-2 py-1 rounded text-xs font-bold shadow"
                      style={{
                        left: `${data.x}%`,
                        top: `${data.y}%`,
                        transform: "translate(-50%, -50%)"
                      }}
                    >
                      {player.name}
                      <div className="text-[10px] opacity-70">
                        {player.age} | {player.primaryPosition}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ================= BANK ================= */}

              <div
                className="mt-6 bg-black/40 p-4 rounded-xl flex gap-3"
              >
                <DropBench id="bench" />
                {benchPlayers.map(p => (
                  <PlayerCard key={p._id} player={p} />
                ))}
              </div>
            </div>

            {/* ================= KADER LISTE ================= */}

            <div className="w-80 bg-black/40 p-6 rounded-xl overflow-y-auto h-[900px]">

              <Section title="Startelf" players={startPlayers} />
              <Section title="Bank" players={benchPlayers} />
              <Section title="Nicht im Kader" players={squadPlayers} />

            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

/* ================= COMPONENTS ================= */

function FieldSlot({ id, x, y }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`absolute w-14 h-14 rounded-full border-2 flex items-center justify-center text-xs font-bold
      ${isOver ? "bg-yellow-400" : "bg-white/60"}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)"
      }}
    >
      {id}
    </div>
  );
}

function DropBench({ id }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-24 h-24 rounded-lg border-2 flex items-center justify-center text-xs
      ${isOver ? "bg-yellow-400" : "bg-gray-700"}`}
    >
      Bank
    </div>
  );
}

function PlayerCard({ player }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({ id: player._id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-gray-800 p-3 mb-3 rounded cursor-grab hover:bg-gray-700 transition shadow"
    >
      <div className="font-semibold">{player.name}</div>
      <div className="text-xs opacity-70">
        {player.age} | {player.primaryPosition}
      </div>
      <div className="text-yellow-400">
        {"⭐".repeat(Math.round(player.starRating || 3))}
      </div>
    </div>
  );
}

function Section({ title, players }) {
  return (
    <div className="mb-6">
      <div className="font-bold mb-2">{title}</div>
      {players.map(p => (
        <PlayerCard key={p._id} player={p} />
      ))}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <div className="text-xs mb-1">{label}</div>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 p-2 rounded"
      >
        <option value="">–</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}