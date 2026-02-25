import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";

/* =====================================================
 SLOT SYSTEM
===================================================== */

const fieldSlots = [
  { id: "GK1", type: "GK", x: 50, y: 95 },

  { id: "CB1", type: "CB", x: 30, y: 85 },
  { id: "CB2", type: "CB", x: 50, y: 88 },
  { id: "CB3", type: "CB", x: 70, y: 85 },

  { id: "LB1", type: "LB", x: 12, y: 75 },
  { id: "RB1", type: "RB", x: 88, y: 75 },

  { id: "LWB1", type: "LWB", x: 6, y: 65 },
  { id: "RWB1", type: "RWB", x: 94, y: 65 },

  { id: "CDM1", type: "CDM", x: 30, y: 65 },
  { id: "CDM2", type: "CDM", x: 50, y: 68 },
  { id: "CDM3", type: "CDM", x: 70, y: 65 },

  { id: "CM1", type: "CM", x: 30, y: 55 },
  { id: "CM2", type: "CM", x: 50, y: 55 },
  { id: "CM3", type: "CM", x: 70, y: 55 },

  { id: "CAM1", type: "CAM", x: 30, y: 40 },
  { id: "CAM2", type: "CAM", x: 50, y: 38 },
  { id: "CAM3", type: "CAM", x: 70, y: 40 },

  { id: "LW1", type: "LW", x: 10, y: 30 },
  { id: "RW1", type: "RW", x: 90, y: 30 },

  { id: "ST1", type: "ST", x: 30, y: 18 },
  { id: "ST2", type: "ST", x: 50, y: 16 },
  { id: "ST3", type: "ST", x: 70, y: 18 }
];

/* =====================================================
 TEAM PAGE
===================================================== */

export default function TeamPage() {

  const [team, setTeam] = useState(null);
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

      setTeam(teamData);
      setLineup(teamData.lineup || {});
      setBench(teamData.bench || []);

      const playersRes = await fetch("/api/player/my-team", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPlayers(await playersRes.json());
    };

    load();
  }, []);

  useEffect(() => {
    if (!team) return;

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

  /* ================= DRAG ================= */

  const removePlayerFromLineup = (updated, playerId) => {
    for (const slotId in updated) {
      if (updated[slotId]?.player === playerId) {
        delete updated[slotId];
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const player = players.find(p => p._id === active.id);
    if (!player) return;

    const slot = fieldSlots.find(s => s.id === over.id);

    /* ===== DROP AUF SPIELFELD ===== */
    if (slot) {

      if (!player.positions?.includes(slot.type)) return;

      setLineup(prev => {
        const updated = { ...prev };

        if (!updated[slot.id] && Object.keys(updated).length >= 11)
          return prev;

        updated[slot.id] = {
          player: player._id,
          role: updated[slot.id]?.role || "standard"
        };

        return updated;
      });

      setBench(prev => prev.filter(id => id !== player._id));
      return;
    }

    /* ===== DROP AUF BANK ===== */
    if (over.id === "bench") {

      if (bench.length >= 7 && !bench.includes(player._id)) return;

      setLineup(prev => {
        const updated = { ...prev };
        removePlayerFromLineup(updated, player._id);
        return updated;
      });

      setBench(prev =>
        prev.includes(player._id) ? prev : [...prev, player._id]
      );

      return;
    }

    /* ===== DROP AUF REST ===== */
    if (over.id === "rest") {

      setLineup(prev => {
        const updated = { ...prev };
        removePlayerFromLineup(updated, player._id);
        return updated;
      });

      setBench(prev => prev.filter(id => id !== player._id));
    }
  };

  if (!team) return null;

  const starters = players.filter(p =>
    Object.values(lineup).some(e => e.player === p._id)
  );

  const benchPlayers = players.filter(p =>
    bench.includes(p._id)
  );

  const rest = players.filter(p =>
    !bench.includes(p._id) &&
    !Object.values(lineup).some(e => e.player === p._id)
  );

  return (
    <DndContext
      onDragStart={(e) => {
        const p = players.find(pl => pl._id === e.active.id);
        setDraggingPlayer(p);
      }}
      onDragEnd={(e) => {
        handleDragEnd(e);
        setDraggingPlayer(null);
      }}
    >

      <div className="max-w-[1500px] mx-auto p-6 text-white">

        <div className="flex gap-12">

          <div className="flex flex-col items-center">

            <div className="mb-3 text-lg font-semibold">
              Startelf ({starters.length}/11)
            </div>

            <Pitch
              lineup={lineup}
              players={players}
              draggingPlayer={draggingPlayer}
            />

            <Bench bench={benchPlayers} />
          </div>

          <SquadList
            starters={starters}
            benchPlayers={benchPlayers}
            rest={rest}
          />

        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {draggingPlayer ? (
          <div className="pointer-events-none flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-xs font-bold">
              {draggingPlayer.positions[0]}
            </div>
            <div className="text-xs text-white">
              {draggingPlayer.lastName}
            </div>
          </div>
        ) : null}
      </DragOverlay>

    </DndContext>
  );
}

/* =====================================================
 PITCH
===================================================== */

function Pitch({ lineup, players, draggingPlayer }) {

  return (
    <div className="relative w-[750px] h-[950px] bg-green-700 rounded-xl shadow-2xl">

      <div className="absolute inset-0 border-4 border-white"></div>
      <div className="absolute top-1/2 w-full h-[2px] bg-white"></div>

      {fieldSlots.map(slot => {

        const { setNodeRef } = useDroppable({ id: slot.id });

        const entry = lineup[slot.id];
        const player = players.find(p => p._id === entry?.player);

        return (
          <div
            key={slot.id}
            ref={setNodeRef}
            style={{
              position: "absolute",
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              transform: "translate(-50%,-50%)"
            }}
          >

            {player && <FieldPlayer player={player} />}

            {draggingPlayer &&
              draggingPlayer.positions?.includes(slot.type) &&
              !player && (
                <div className="w-14 h-14 rounded-full border border-white/40 bg-white/10"></div>
              )}

          </div>
        );
      })}

    </div>
  );
}