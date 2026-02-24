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

/* ================= ROLLEN ================= */

const roleOptions = {
  ST: ["Zielspieler", "Pressingstürmer"],
  RW: ["Flügelspieler", "Inverser Flügel"],
  LW: ["Flügelspieler", "Inverser Flügel"],
  DM: ["Abräumer", "Spielmacher"],
  RCM: ["Box-to-Box", "Spielmacher"],
  LCM: ["Box-to-Box", "Spielmacher"],
  RB: ["Defensiver AV", "Offensiver AV"],
  LB: ["Defensiver AV", "Offensiver AV"],
  RCB: ["Innenverteidiger"],
  LCB: ["Innenverteidiger"],
  GK: ["Mitspielender Torwart"]
};

export default function TeamPage() {

  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
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
      body: JSON.stringify({ lineup, bench })
    });
  }, [lineup, bench]);

  if (!team) return null;

  /* ================= DRAG LOGIC ================= */

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || locked) return;

    const player = players.find(p => p._id === active.id);
    if (!player) return;

    const dropZone = over.id;

    // ===== Drop auf Spielfeld =====
    if (fieldSlots[dropZone]) {

      if (!player.positions?.includes(dropZone)) return;

      // Swap falls Position belegt
      const occupiedId = Object.keys(lineup)
        .find(id => lineup[id]?.position === dropZone);

      setBench(prev => prev.filter(id => id !== player._id));

      setLineup(prev => {
        const updated = { ...prev };

        if (occupiedId) {
          updated[occupiedId] = {
            position: prev[player._id]?.position || null,
            role: prev[occupiedId]?.role
          };
        }

        updated[player._id] = {
          position: dropZone,
          role: roleOptions[dropZone]?.[0]
        };

        return updated;
      });
    }

    // ===== Drop auf Bank =====
    if (dropZone === "bench") {

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

  const startingIds = Object.keys(lineup);
  const starters = players.filter(p => startingIds.includes(p._id));
  const benchPlayers = players.filter(p => bench.includes(p._id));
  const rest = players.filter(
    p => !startingIds.includes(p._id) && !bench.includes(p._id)
  );

  /* ================= UI ================= */

  return (
    <DndContext onDragEnd={handleDragEnd}>

      <div className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/lockerroom.jpg')" }}>

        <div className="bg-black/80 min-h-screen">

          <div className="max-w-[1400px] mx-auto p-6 text-white">

            <div className="flex gap-10 justify-center">

              <Pitch lineup={lineup} players={players} />

              <div className="w-[400px] bg-black/40 p-6 rounded-xl">

                <Category title="Startelf" players={starters} />
                <Category title="Bank" players={benchPlayers} />
                <Category title="Nicht im Kader" players={rest} />

              </div>

            </div>

            <Bench bench={bench} players={players} />

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

      {/* Außenlinien */}
      <div className="absolute inset-0 border-4 border-white"></div>

      {/* Mittellinie */}
      <div className="absolute top-1/2 w-full h-[2px] bg-white"></div>

      {/* Mittelkreis */}
      <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>

      {/* Anstoßpunkt */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>

      {/* 16er */}
      <div className="absolute top-0 left-1/2 w-80 h-40 border-2 border-white -translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/2 w-80 h-40 border-2 border-white -translate-x-1/2"></div>

      {/* 5m Räume */}
      <div className="absolute top-0 left-1/2 w-36 h-20 border-2 border-white -translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/2 w-36 h-20 border-2 border-white -translate-x-1/2"></div>

      {Object.entries(fieldSlots).map(([pos, coords]) => {

        const playerId = Object.keys(lineup)
          .find(id => lineup[id]?.position === pos);

        const player = players.find(p => p._id === playerId);

        return (
          <FieldSlot key={pos} id={pos} x={coords.x} y={coords.y}>
            {player && (
              <PlayerOnField
                player={player}
                role={lineup[player._id]?.role}
                position={pos}
              />
            )}
          </FieldSlot>
        );
      })}
    </div>
  );
}

/* ================= PLAYER ON FIELD ================= */

function PlayerOnField({ player, role, position }) {

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
      className="bg-white text-black px-2 py-1 rounded text-xs font-bold cursor-grab"
    >
      {player.firstName} {player.lastName}

      {role && (
        <div className="text-[10px] text-gray-600">
          {role}
        </div>
      )}
    </div>
  );
}

/* ================= FIELD SLOT ================= */

function FieldSlot({ id, x, y, children }) {

  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="absolute text-center"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)"
      }}
    >
      {children}
    </div>
  );
}

/* ================= DRAGGABLE PLAYER ================= */

function DraggablePlayer({ player }) {

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
      className="bg-white text-black px-2 py-1 rounded text-xs font-bold cursor-grab"
    >
      {player.firstName} {player.lastName}
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
      className="mt-6 w-[700px] bg-black/40 p-4 rounded-xl mx-auto"
    >
      <h3 className="mb-3 font-semibold">Bank (7 Plätze)</h3>

      <div className="grid grid-cols-7 gap-3">

        {[...Array(7)].map((_, i) => {
          const player = players.find(p => p._id === bench[i]);

          return (
            <div
              key={i}
              className="h-16 bg-gray-800 rounded flex items-center justify-center text-xs"
            >
              {player && <DraggablePlayer player={player} />}
            </div>
          );
        })}

      </div>
    </div>
  );
}