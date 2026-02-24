import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useState } from "react";

// =============================
// Feld-Positionen
// =============================
const fieldPositions = [
  { id: "GK", top: "90%", left: "50%" },
  { id: "LCB", top: "70%", left: "35%" },
  { id: "RCB", top: "70%", left: "65%" },
  { id: "CM", top: "50%", left: "50%" },
  { id: "ST", top: "20%", left: "50%" },
];

const roleOptions = {
  GK: ["mitspielender_keeper", "klassischer_keeper"],
  LCB: ["klassischer_iv", "ballspielender_iv"],
  RCB: ["klassischer_iv", "ballspielender_iv"],
  CM: ["box_to_box", "spielmacher"],
  ST: ["zielspieler", "falsche_9", "konterstürmer"],
};

export default function TeamPage() {
  const [lineup, setLineup] = useState({});

  const [players] = useState([
    {
      id: "1",
      name: "Müller",
      primaryPosition: "ST",
    },
    {
      id: "2",
      name: "Schmidt",
      primaryPosition: "LCB",
    },
  ]);

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (!over) return;

    const player = players.find((p) => p.id === active.id);
    const dropTarget = over.id;

    if (!player) return;

    if (dropTarget === "bench") {
      const newLineup = { ...lineup };
      Object.keys(newLineup).forEach((pos) => {
        if (newLineup[pos]?.playerId === player.id) {
          delete newLineup[pos];
        }
      });
      setLineup(newLineup);
      return;
    }

    setLineup((prev) => ({
      ...prev,
      [dropTarget]: {
        playerId: player.id,
        role: roleOptions[dropTarget]?.[0] || null,
      },
    }));
  };

  const changeRole = (position, role) => {
    setLineup((prev) => ({
      ...prev,
      [position]: {
        ...prev[position],
        role,
      },
    }));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex p-10 gap-12 bg-gray-900 min-h-screen">

        {/* ============================= */}
        {/* STADION RAHMEN */}
        {/* ============================= */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl">

          {/* ============================= */}
          {/* SPIELFELD */}
          {/* ============================= */}
          <div className="relative w-[600px] h-[900px] bg-green-700 rounded-lg border-4 border-white overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)]">

            {/* Rasen Muster */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-600 via-green-700 to-green-600 opacity-60"></div>

            {/* Mittellinie */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white"></div>

            {/* Mittelkreis */}
            <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* Anstoßpunkt */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* STRAFRAUM OBEN */}
            <div className="absolute top-0 left-1/2 w-80 h-36 border-2 border-white transform -translate-x-1/2"></div>
            <div className="absolute top-0 left-1/2 w-40 h-16 border-2 border-white transform -translate-x-1/2"></div>
            <div className="absolute -top-3 left-1/2 w-28 h-6 bg-gray-200 border border-white transform -translate-x-1/2"></div>

            {/* STRAFRAUM UNTEN */}
            <div className="absolute bottom-0 left-1/2 w-80 h-36 border-2 border-white transform -translate-x-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-40 h-16 border-2 border-white transform -translate-x-1/2"></div>
            <div className="absolute -bottom-3 left-1/2 w-28 h-6 bg-gray-200 border border-white transform -translate-x-1/2"></div>

            {/* ============================= */}
            {/* SPIELER SLOTS */}
            {/* ============================= */}
            {fieldPositions.map((pos) => (
              <FieldSlot
                key={pos.id}
                pos={pos}
                data={lineup[pos.id]}
                players={players}
                changeRole={changeRole}
              />
            ))}
          </div>
        </div>

        {/* ============================= */}
        {/* SPIELERBANK */}
        {/* ============================= */}
        <Bench players={players} lineup={lineup} />
      </div>
    </DndContext>
  );
}

// =============================
// Spielfeld Slot
// =============================
function FieldSlot({ pos, data, players, changeRole }) {
  const { setNodeRef, isOver } = useDroppable({ id: pos.id });

  const player = players.find((p) => p.id === data?.playerId);

  return (
    <div
      ref={setNodeRef}
      className={`absolute w-28 h-28 rounded-full flex flex-col items-center justify-center text-xs font-bold text-center p-2 transition
      ${isOver ? "bg-yellow-400 scale-105" : "bg-white"}`}
      style={{
        top: pos.top,
        left: pos.left,
        transform: "translate(-50%, -50%)",
      }}
    >
      {player ? (
        <>
          <div>{player.name}</div>

          <select
            className="text-xs mt-1"
            value={data.role}
            onChange={(e) => changeRole(pos.id, e.target.value)}
          >
            {roleOptions[pos.id]?.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </>
      ) : (
        pos.id
      )}
    </div>
  );
}

// =============================
// Spielerbank
// =============================
function Bench({ players, lineup }) {
  const { setNodeRef } = useDroppable({ id: "bench" });

  const placedIds = Object.values(lineup).map((p) => p?.playerId);

  return (
    <div ref={setNodeRef} className="w-60">
      <h2 className="text-white mb-4 text-lg font-bold">Spieler</h2>

      {players
        .filter((player) => !placedIds.includes(player.id))
        .map((player) => (
          <DraggablePlayer key={player.id} player={player} />
        ))}
    </div>
  );
}

// =============================
// Draggable Spieler
// =============================
function DraggablePlayer({ player }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({ id: player.id });

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
      className="bg-gray-800 text-white p-3 mb-3 rounded cursor-grab hover:bg-gray-700"
    >
      <div className="font-semibold">{player.name}</div>
      <div className="text-xs text-gray-400">
        {player.primaryPosition}
      </div>
    </div>
  );
}