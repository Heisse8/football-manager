import { useEffect, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";

/* ================= ALLE POSITIONEN ================= */

const fieldSlots = {

  GK: { x: 50, y: 94 },

  LB: { x: 12, y: 75 },
  LCB: { x: 32, y: 84 },
  CB: { x: 50, y: 87 },
  RCB: { x: 68, y: 84 },
  RB: { x: 88, y: 75 },

  LWB: { x: 8, y: 60 },
  RWB: { x: 92, y: 60 },

  LDM: { x: 32, y: 66 },
  CDM: { x: 50, y: 69 },
  RDM: { x: 68, y: 66 },

  LCM: { x: 32, y: 55 },
  CM: { x: 50, y: 55 },
  RCM: { x: 68, y: 55 },

  LAM: { x: 32, y: 40 },
  CAM: { x: 50, y: 38 },
  RAM: { x: 68, y: 40 },

  LW: { x: 12, y: 30 },
  RW: { x: 88, y: 30 },

  LS: { x: 35, y: 20 },
  ST: { x: 50, y: 18 },
  RS: { x: 65, y: 20 }
};

export default function TeamPage() {

  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
  const [tactics, setTactics] = useState({});
  const [draggingPlayer, setDraggingPlayer] = useState(null);
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

    // === Spielfeld ===
    if (fieldSlots[dropZone]) {

      if (!player.positions?.includes(dropZone)) return;

      const occupiedId = Object.keys(lineup)
        .find(id => lineup[id] === dropZone);

      setLineup(prev => {

        const updated = { ...prev };

        // Max 11 Spieler
        if (!updated[player._id] && Object.keys(updated).length >= 11)
          return prev;

        // Swap
        if (occupiedId && occupiedId !== player._id) {

          const oldPos = prev[player._id];
          const otherPlayer = players.find(p => p._id === occupiedId);

          if (otherPlayer?.positions?.includes(oldPos)) {
            updated[occupiedId] = oldPos;
          } else {
            delete updated[occupiedId];
          }
        }

        updated[player._id] = dropZone;

        return updated;
      });

      setBench(prev => prev.filter(id => id !== player._id));
    }

    // === Bank ===
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
    <DndContext
      onDragStart={(event) => {
        const p = players.find(pl => pl._id === event.active.id);
        setDraggingPlayer(p);
      }}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setDraggingPlayer(null);
      }}
    >

      <div className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/lockerroom.jpg')" }}>

        <div className="bg-black/80 min-h-screen">

          <div className="max-w-[1500px] mx-auto p-6 text-white">

            {/* ===== 8 Taktikfelder ===== */}

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

            {/* ===== LAYOUT ===== */}

            <div className="flex gap-12 justify-center items-start">

              {/* Spielfeld + Bank */}
              <div className="flex flex-col items-center">

                <Pitch
                  lineup={lineup}
                  players={players}
                  draggingPlayer={draggingPlayer}
                />

                <Bench bench={bench} players={players} />

              </div>

              {/* Kaderliste */}
              <div className="w-[420px] bg-black/40 p-6 rounded-xl">

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

function Pitch({ lineup, players, draggingPlayer }) {

  return (
    <div className="relative w-[750px] h-[950px] bg-green-700 rounded-xl shadow-2xl">

      {/* Linien */}
      <div className="absolute inset-0 border-4 border-white"></div>
      <div className="absolute top-1/2 w-full h-[2px] bg-white"></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>

      {Object.entries(fieldSlots).map(([pos, coords]) => {

        const playerId = Object.keys(lineup)
          .find(id => lineup[id] === pos);

        const player = players.find(p => p._id === playerId);

        return (
          <FieldSlot key={pos} id={pos} x={coords.x} y={coords.y}>

            {player && <FieldPlayer player={player} />}

            {draggingPlayer &&
             draggingPlayer.positions?.includes(pos) &&
             !player && (
               <div className="w-14 h-14 rounded-full border-2 border-yellow-400 animate-pulse"></div>
            )}

          </FieldSlot>
        );
      })}
    </div>
  );
}

function FieldSlot({ id, x, y, children }) {

  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)"
      }}
    >
      {children}
    </div>
  );
}

/* ================= FIELD PLAYER (CLEAN UI) ================= */

function FieldPlayer({ player }) {

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
      className="flex flex-col items-center cursor-grab select-none"
    >
      <div className="w-14 h-14 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-xs font-bold shadow-lg">
        {player.positions[0]}
      </div>

      <div className="mt-1 text-xs font-semibold text-white w-24 text-center truncate">
        {player.lastName}
      </div>

      <div className="text-yellow-400 text-[10px]">
        {"★".repeat(Math.round(player.stars))}
      </div>
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

/* ================= DRAGGABLE LIST PLAYER ================= */

function DraggablePlayer({ player }) {

  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({ id: player._id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}
      className="bg-gray-900 p-3 rounded mb-2 shadow cursor-grab">

      <div className="font-semibold">
        {player.firstName} {player.lastName}
      </div>

      <div className="text-xs text-gray-400">
        {player.age} Jahre • {player.positions.join(", ")}
      </div>

      <div className="text-yellow-400 text-xs">
        {"★".repeat(Math.round(player.stars))}
      </div>
    </div>
  );
}

/* ================= BENCH ================= */

function Bench({ bench, players }) {

  const { setNodeRef } = useDroppable({ id: "bench" });

  return (
    <div ref={setNodeRef}
      className="mt-6 w-[750px] bg-black/40 p-4 rounded-xl">

      <h3 className="mb-3 font-semibold">
        Bank ({bench.length}/7)
      </h3>

      <div className="grid grid-cols-7 gap-3">
        {bench.map(id => {
          const player = players.find(p => p._id === id);
          return player && <DraggablePlayer key={id} player={player} />;
        })}
      </div>
    </div>
  );
}

/* ================= SELECT ================= */

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