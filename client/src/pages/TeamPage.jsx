import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";

/* =====================================================
 FORMATIONS
===================================================== */

const formations = {

  "4-4-2": [
    "GK",
    "LB","LCB","RCB","RB",
    "LCM","RCM",
    "LW","RW",
    "LST","RST"
  ],

  "4-2-3-1": [
    "GK",
    "LB","LCB","RCB","RB",
    "LDM","RDM",
    "CAM",
    "LW","RW",
    "ST"
  ],

  "4-3-3": [
    "GK",
    "LB","LCB","RCB","RB",
    "CDM",
    "LCM","RCM",
    "LW","RW",
    "ST"
  ],

  "4-1-4-1": [
    "GK",
    "LB","LCB","RCB","RB",
    "CDM",
    "LCM","RCM",
    "LW","RW",
    "ST"
  ],

  "4-1-2-1-2": [
    "GK",
    "LB","LCB","RCB","RB",
    "CDM",
    "LCM","RCM",
    "CAM",
    "LST","RST"
  ],

  /* =========================
     NEUE FORMATIONEN
     ========================= */

  "3-4-3": [
    "GK",
    "LCB","CCB","RCB",
    "LB","RB",
    "LCM","RCM",
    "LW","RW",
    "ST"
  ],

  "3-4-2-1": [
    "GK",
    "LCB","CCB","RCB",
    "LB","RB",
    "LCM","RCM",
    "LAM","RAM",
    "ST"
  ],

  "3-5-2": [
    "GK",
    "LCB","CCB","RCB",
    "LB","RB",
    "CDM",
    "LCM","RCM",
    "LST","RST"
  ]

};

/* =====================================================
 POSITION GROUPS (flexible zentrale Rollen)
===================================================== */

const positionGroups = {
  ST: ["LST", "ST", "RST"],
  CAM: ["LAM", "CAM", "RAM"],
  CM: ["LCM", "CCM", "RCM"],
  CDM: ["LDM", "CDM", "RDM"],
  CB: ["LCB", "CCB", "RCB"],
  LB: ["LB"],
  RB: ["RB"],
  LW: ["LW"],
  RW: ["RW"],
  LM: ["LM"],
  RM: ["RM"],
  GK: ["GK"]
};

/* =====================================================
 SLOT COORDINATES
===================================================== */

const slotCoordinates = {
  GK: { x: 50, y: 95 },

  LB: { x: 10, y: 80 },
  LCB: { x: 30, y: 85 },
  CCB: { x: 50, y: 88 },
  RCB: { x: 70, y: 85 },
  RB: { x: 90, y: 80 },

  LDM: { x: 30, y: 65 },
  CDM: { x: 50, y: 68 },
  RDM: { x: 70, y: 65 },

  LCM: { x: 30, y: 55 },
  CCM: { x: 50, y: 55 },
  RCM: { x: 70, y: 55 },

  LAM: { x: 30, y: 40 },
  CAM: { x: 50, y: 38 },
  RAM: { x: 70, y: 40 },

  LW: { x: 15, y: 25 },
  RW: { x: 85, y: 25 },

  LM: { x: 15, y: 45 },
  RM: { x: 85, y: 45 },

  LST: { x: 35, y: 18 },
  ST: { x: 50, y: 16 },
  RST: { x: 65, y: 18 }
};

/* =====================================================
 TEAM PAGE
===================================================== */

export default function TeamPage() {

  const [formation, setFormation] = useState("4-3-3");
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [draggingPlayer, setDraggingPlayer] = useState(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");

      const playersRes = await fetch("/api/player/my-team", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await playersRes.json();
      setPlayers(Array.isArray(data) ? data : []);
    };

    load();
  }, []);

  /* =====================================================
   DRAG END
  ===================================================== */

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const cleanId = active.id.replace("field-", "").replace("list-", "");
    const player = players.find(p => p._id === cleanId);
    if (!player) return;

    const slotId = over.id;

    // Slot muss in aktueller Formation existieren
    if (!formations[formation].includes(slotId)) return;

    // Flexible Positionsprüfung
    const canPlay = player.positions?.some(pos =>
      positionGroups[pos]?.includes(slotId)
    );

    if (!canPlay) return;

    setLineup(prev => {
      const updated = { ...prev };

      // Spieler aus alter Position entfernen
      Object.keys(updated).forEach(key => {
        if (updated[key] === player._id) delete updated[key];
      });

      // Max 11 Spieler
      if (!updated[slotId] && Object.keys(updated).length >= 11)
        return prev;

      updated[slotId] = player._id;
      return updated;
    });
  };

  /* =====================================================
   RENDER
  ===================================================== */

  return (
    <DndContext
      onDragStart={(event) => {
        const cleanId = event.active.id
          .replace("field-", "")
          .replace("list-", "");
        const player = players.find(p => p._id === cleanId);
        setDraggingPlayer(player);
      }}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setDraggingPlayer(null);
      }}
    >

      <div className="max-w-[1500px] mx-auto p-6 text-white">

        {/* Formation Selector */}
        <div className="mb-6">
          <select
            value={formation}
            onChange={(e) => {
              setFormation(e.target.value);
              setLineup({});
            }}
            className="bg-gray-800 p-2 rounded"
          >
            {Object.keys(formations).map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-12">

          {/* Pitch */}
          <div className="relative w-[750px] h-[950px] bg-green-700 rounded-xl shadow-2xl">

            {formations[formation].map(slotId => {

              const { setNodeRef } = useDroppable({ id: slotId });
              const coords = slotCoordinates[slotId];

              if (!coords) return null; // kein Crash mehr

              const player = players.find(
                p => p._id === lineup[slotId]
              );

              return (
                <div
                  key={slotId}
                  ref={setNodeRef}
                  style={{
                    position: "absolute",
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: "translate(-50%,-50%)"
                  }}
                >
                  {player && <FieldPlayer player={player} />}
                </div>
              );
            })}

          </div>

          {/* Squad */}
          <div className="w-[420px] bg-black/40 p-6 rounded-xl">
            {players.map(p => (
              <PlayerCard key={p._id} player={p} />
            ))}
          </div>

        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {draggingPlayer && <Circle player={draggingPlayer} />}
      </DragOverlay>

    </DndContext>
  );
}

/* =====================================================
 PLAYER CARD
===================================================== */

function PlayerCard({ player }) {
  const { attributes, listeners, setNodeRef } =
    useDraggable({ id: `list-${player._id}` });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-gray-900 p-3 rounded mb-2 shadow cursor-grab"
    >
      {player.firstName} {player.lastName}
    </div>
  );
}

/* =====================================================
 FIELD PLAYER
===================================================== */

function FieldPlayer({ player }) {
  const { attributes, listeners, setNodeRef } =
    useDraggable({ id: `field-${player._id}` });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab"
    >
      <Circle player={player} />
    </div>
  );
}

function Circle({ player }) {
  return (
    <div className="w-14 h-14 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-xs font-bold">
      {player.positions[0]}
    </div>
  );
}