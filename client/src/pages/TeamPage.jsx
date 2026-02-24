import { useEffect, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";

/* ================= POSITIONEN ================= */

const fieldSlots = {
  GK: { x: 50, y: 94 },
  RB: { x: 82, y: 75 },
  LB: { x: 18, y: 75 },
  RCB: { x: 62, y: 85 },
  LCB: { x: 38, y: 85 },
  DM: { x: 50, y: 65 },
  RCM: { x: 65, y: 55 },
  LCM: { x: 35, y: 55 },
  RW: { x: 85, y: 35 },
  LW: { x: 15, y: 35 },
  ST: { x: 50, y: 22 }
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

      setPlayers(await playersRes.json());
    };

    load();
  }, []);

  /* ================= AUTO SAVE ================= */

  useEffect(() => {
    if (!team || locked) return;

    const token = localStorage.getItem("token");

    fetch("/api/team/lineup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ lineup, bench, tactics })
    });
  }, [lineup, bench, tactics]);

  if (!team) return null;

  /* ================= DRAG SYSTEM ================= */

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || locked) return;

    const player = players.find(p => p._id === active.id);
    if (!player) return;

    const dropZone = over.id;

    /* ===== Spielfeld ===== */
    if (fieldSlots[dropZone]) {

      if (!player.positions?.includes(dropZone)) return;

      const occupiedId = Object.keys(lineup)
        .find(id => lineup[id] === dropZone);

      setBench(prev => prev.filter(id => id !== player._id));

      setLineup(prev => {
        const updated = { ...prev };

        if (occupiedId) {
          delete updated[occupiedId];
        }

        if (Object.keys(updated).length < 11 || updated[player._id]) {
          updated[player._id] = dropZone;
        }

        return updated;
      });
    }

    /* ===== Bank ===== */
    if (dropZone === "bench") {

      if (bench.length >= 7 && !bench.includes(player._id)) return;

      setLineup(prev => {
        const updated = { ...prev };
        delete updated[player._id];
        return updated;
      });

      setBench(prev =>
        prev.includes(player._id) ? prev : [...prev, player._id]
      );
    }
  };

  /* ================= FILTER ================= */

  const starters = players.filter(p =>
    Object.keys(lineup).includes(p._id)
  );

  const benchPlayers = players.filter(p =>
    bench.includes(p._id)
  );

  const rest = players.filter(p =>
    !Object.keys(lineup).includes(p._id) &&
    !bench.includes(p._id)
  );

  /* ================= UI ================= */

  return (
    <DndContext onDragEnd={handleDragEnd}>

      <div className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/lockerroom.jpg')" }}>

        <div className="bg-black/80 min-h-screen">

          <div className="max-w-[1400px] mx-auto p-6 text-white">

            {/* ================= TACTICS ================= */}

            <div className="grid grid-cols-4 gap-4 mb-8 bg-black/40 p-4 rounded-xl">

              <Select label="Spielidee"
                value={tactics.style}
                onChange={v => setTactics({ ...tactics, style: v })}
                options={["ballbesitz","konter","gegenpressing","mauern"]} />

              <Select label="Tempo"
                value={tactics.tempo}
                onChange={v => setTactics({ ...tactics, tempo: v })}
                options={["langsam","normal","hoch"]} />

              <Select label="Mentalität"
                value={tactics.mentality}
                onChange={v => setTactics({ ...tactics, mentality: v })}
                options={["defensiv","ausgewogen","offensiv"]} />

              <Select label="Passspiel"
                value={tactics.passing}
                onChange={v => setTactics({ ...tactics, passing: v })}
                options={["kurz","variabel","lang"]} />

              <Select label="Abwehrlinie"
                value={tactics.defensiveLine}
                onChange={v => setTactics({ ...tactics, defensiveLine: v })}
                options={["tief","mittel","hoch"]} />

              <Select label="Pressing"
                value={tactics.pressing}
                onChange={v => setTactics({ ...tactics, pressing: v })}
                options={["niedrig","mittel","hoch"]} />

              <Select label="Breite"
                value={tactics.width}
                onChange={v => setTactics({ ...tactics, width: v })}
                options={["schmal","normal","breit"]} />

              <Select label="Ballverlust"
                value={tactics.transition}
                onChange={v => setTactics({ ...tactics, transition: v })}
                options={["gegenpressing","zurückziehen"]} />

            </div>

            {/* ================= LAYOUT ================= */}

            <div className="flex gap-10 justify-center items-start">

              {/* SPIELFELD + BANK */}
              <div className="flex flex-col items-center">

                <Pitch lineup={lineup} players={players} />

                <Bench bench={bench} players={players} />

              </div>

              {/* KADERLISTE */}
              <div className="w-[400px] bg-black/40 p-6 rounded-xl">

                <Category title="Startelf" players={starters} />
                <Category title="Bank" players={benchPlayers} />
                <Category title="Nicht im Kader" players={rest} />

              </div>

            </div>

          </div>
        </div>
      </div>

    </DndContext>
  );
}

/* ================= PITCH ================= */

function Pitch({ lineup, players }) {

  return (
    <div className="relative w-[700px] h-[900px] bg-green-700 rounded-xl shadow-2xl">

      <div className="absolute inset-0 border-4 border-white"></div>
      <div className="absolute top-1/2 w-full h-[2px] bg-white"></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 left-1/2 w-80 h-40 border-2 border-white -translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/2 w-80 h-40 border-2 border-white -translate-x-1/2"></div>
      <div className="absolute top-0 left-1/2 w-36 h-20 border-2 border-white -translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/2 w-36 h-20 border-2 border-white -translate-x-1/2"></div>

      {Object.entries(fieldSlots).map(([pos, coords]) => {

        const playerId = Object.keys(lineup)
          .find(id => lineup[id] === pos);

        const player = players.find(p => p._id === playerId);

        return (
          <FieldSlot key={pos} id={pos} x={coords.x} y={coords.y}>

            {player && <DraggablePlayer player={player} />}

            {!player && (
              <div className="w-14 h-14 rounded-full border-2 border-white/30"></div>
            )}

          </FieldSlot>
        );
      })}
    </div>
  );
}

function FieldSlot({ id, x, y, children }) {

  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)"
      }}
      className={isOver ? "scale-110 transition" : ""}
    >
      {children}
    </div>
  );
}

/* ================= PLAYER CARD ================= */

function PlayerCard({ player }) {
  return (
    <div className="bg-gray-900 p-3 rounded shadow cursor-grab text-white w-40 text-center">
      <div className="font-semibold">
        {player.firstName} {player.lastName}
      </div>
      <div className="text-xs text-gray-400">
        {player.age} • {player.positions.join(", ")}
      </div>
      <div className="text-yellow-400 text-xs">
        {"★".repeat(Math.round(player.stars))}
      </div>
    </div>
  );
}

function DraggablePlayer({ player }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({ id: player._id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <PlayerCard player={player} />
    </div>
  );
}

/* ================= CATEGORY ================= */

function Category({ title, players }) {
  return (
    <>
      <h3 className="font-semibold mt-4 mb-2">{title}</h3>
      {players.map(p => (
        <DraggablePlayer key={p._id} player={p} />
      ))}
    </>
  );
}

/* ================= BENCH ================= */

function Bench({ bench, players }) {

  const { setNodeRef } = useDroppable({ id: "bench" });

  return (
    <div
      ref={setNodeRef}
      className="mt-6 w-[700px] bg-black/40 p-4 rounded-xl">

      <h3 className="mb-3 font-semibold">
        Bank ({bench.length}/7)
      </h3>

      <div className="grid grid-cols-7 gap-3">
        {bench.map(id => {
          const player = players.find(p => p._id === id);
          return player && (
            <DraggablePlayer key={id} player={player} />
          );
        })}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <div className="text-xs mb-1">{label}</div>
      <select
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-800 p-2 rounded"
      >
        <option value="">-</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}