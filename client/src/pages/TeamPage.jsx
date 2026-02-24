import { useEffect, useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

/* ================= ULTRA FREE SLOT SYSTEM ================= */

const fieldSlots = [

  // TOR
  { id: "GK1", type: "GK", x: 50, y: 95 },

  // INNENVERTEIDIGER (3)
  { id: "CB1", type: "CB", x: 30, y: 85 },
  { id: "CB2", type: "CB", x: 50, y: 88 },
  { id: "CB3", type: "CB", x: 70, y: 85 },

  // AUSSENVERTEIDIGER
  { id: "LB1", type: "LB", x: 12, y: 75 },
  { id: "RB1", type: "RB", x: 88, y: 75 },

  // WINGBACKS
  { id: "LWB1", type: "LWB", x: 6, y: 65 },
  { id: "RWB1", type: "RWB", x: 94, y: 65 },

  // CDM (3)
  { id: "CDM1", type: "CDM", x: 30, y: 65 },
  { id: "CDM2", type: "CDM", x: 50, y: 68 },
  { id: "CDM3", type: "CDM", x: 70, y: 65 },

  // CM (3)
  { id: "CM1", type: "CM", x: 30, y: 55 },
  { id: "CM2", type: "CM", x: 50, y: 55 },
  { id: "CM3", type: "CM", x: 70, y: 55 },

  // CAM (3)
  { id: "CAM1", type: "CAM", x: 30, y: 40 },
  { id: "CAM2", type: "CAM", x: 50, y: 38 },
  { id: "CAM3", type: "CAM", x: 70, y: 40 },

  // FLÜGEL
  { id: "LW1", type: "LW", x: 10, y: 30 },
  { id: "RW1", type: "RW", x: 90, y: 30 },

  // ST (3)
  { id: "ST1", type: "ST", x: 30, y: 18 },
  { id: "ST2", type: "ST", x: 50, y: 16 },
  { id: "ST3", type: "ST", x: 70, y: 18 }
];

export default function TeamPage() {

  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
  const [draggingPlayer, setDraggingPlayer] = useState(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");

      const teamRes = await fetch("/api/team", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const teamData = await teamRes.json();
      setLineup(teamData.lineup || {});
      setBench(teamData.bench || []);

      const playersRes = await fetch("/api/player/my-team", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPlayers(await playersRes.json());
    };

    load();
  }, []);

  /* ================= DRAG SYSTEM ================= */

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const player = players.find(p => p._id === active.id);
    if (!player) return;

    const slot = fieldSlots.find(s => s.id === over.id);

    // ===== Spielfeld =====
    if (slot) {

      if (!player.positions?.includes(slot.type)) return;

      const occupiedId = Object.keys(lineup)
        .find(id => lineup[id] === slot.id);

      setLineup(prev => {

        const updated = { ...prev };

        // Max 11 Spieler
        if (!updated[player._id] && Object.keys(updated).length >= 11)
          return prev;

        // Swap Logik
        if (occupiedId && occupiedId !== player._id) {

          const previousSlot = prev[player._id];

          if (previousSlot) {
            updated[occupiedId] = previousSlot;
          } else {
            delete updated[occupiedId];
          }
        }

        updated[player._id] = slot.id;

        return updated;
      });

      setBench(prev => prev.filter(id => id !== player._id));
    }

    // ===== Bank =====
    if (over.id === "bench") {

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

      <div className="flex justify-center gap-12">

        <Pitch
          lineup={lineup}
          players={players}
          draggingPlayer={draggingPlayer}
        />

        <Bench bench={bench} players={players} />

      </div>

    </DndContext>
  );
}

/* ================= PITCH ================= */

function Pitch({ lineup, players, draggingPlayer }) {

  return (
    <div className="relative w-[750px] h-[950px] bg-green-700 rounded-xl shadow-2xl">

      {/* Außenlinien */}
      <div className="absolute inset-0 border-4 border-white"></div>

      {/* Mittellinie */}
      <div className="absolute top-1/2 w-full h-[2px] bg-white"></div>

      {/* Mittelkreis */}
      <div className="absolute top-1/2 left-1/2 w-44 h-44 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>

      {/* 16er oben */}
      <div className="absolute top-0 left-1/2 w-96 h-48 border-2 border-white -translate-x-1/2"></div>

      {/* 16er unten */}
      <div className="absolute bottom-0 left-1/2 w-96 h-48 border-2 border-white -translate-x-1/2"></div>

      {/* 5m oben */}
      <div className="absolute top-0 left-1/2 w-40 h-20 border-2 border-white -translate-x-1/2"></div>

      {/* 5m unten */}
      <div className="absolute bottom-0 left-1/2 w-40 h-20 border-2 border-white -translate-x-1/2"></div>

      {fieldSlots.map(slot => {

        const playerId = Object.keys(lineup)
          .find(id => lineup[id] === slot.id);

        const player = players.find(p => p._id === playerId);

        return (
          <FieldSlot key={slot.id} slot={slot}>

            {player && <FieldPlayer player={player} />}

            {draggingPlayer &&
             draggingPlayer.positions?.includes(slot.type) &&
             !player && (
               <div className="w-16 h-16 rounded-full bg-white/10 border border-white/30 backdrop-blur-md"></div>
            )}

          </FieldSlot>
        );
      })}
    </div>
  );
}

function FieldSlot({ slot, children }) {

  const { setNodeRef } = useDroppable({ id: slot.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        transform: "translate(-50%, -50%)"
      }}
    >
      {children}
    </div>
  );
}

/* ================= FIELD PLAYER ================= */

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
      <div className="w-16 h-16 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-xs font-bold shadow-xl">
        {player.positions[0]}
      </div>

      <div className="mt-1 text-xs font-semibold text-white text-center w-24 truncate">
        {player.lastName}
      </div>

      <div className="text-yellow-400 text-[10px]">
        {"★".repeat(Math.round(player.stars))}
      </div>
    </div>
  );
}

/* ================= BENCH ================= */

function Bench({ bench, players }) {

  const { setNodeRef } = useDroppable({ id: "bench" });

  return (
    <div
      ref={setNodeRef}
      className="w-[300px] bg-black/40 p-4 rounded-xl"
    >
      <h3 className="mb-3 font-semibold">
        Bank ({bench.length}/7)
      </h3>

      {bench.map(id => {
        const player = players.find(p => p._id === id);
        return player && <FieldPlayer key={id} player={player} />;
      })}
    </div>
  );
}