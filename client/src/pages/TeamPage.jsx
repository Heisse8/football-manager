import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

const fieldSlots = {
  GK: { x: 50, y: 90 },
  RB: { x: 75, y: 75 },
  LB: { x: 25, y: 75 },
  RCB: { x: 60, y: 80 },
  LCB: { x: 40, y: 80 },
  CM: { x: 50, y: 60 },
  RM: { x: 75, y: 55 },
  LM: { x: 25, y: 55 },
  RW: { x: 80, y: 35 },
  LW: { x: 20, y: 35 },
  ST: { x: 50, y: 20 },
};

export default function TeamPage() {
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [activePlayer, setActivePlayer] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/player/my-team", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPlayers(data);
    };

    fetchPlayers();
  }, []);

  const handleDragStart = (event) => {
    const player = players.find(p => p._id === event.active.id);
    setActivePlayer(player);
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    setActivePlayer(null);

    if (!over) return;

    const player = players.find(p => p._id === active.id);
    const slot = over.id;

    if (!canPlay(player, slot)) return;

    setLineup(prev => ({
      ...prev,
      [player._id]: {
        position: slot,
        x: fieldSlots[slot].x,
        y: fieldSlots[slot].y,
        role: defaultRoleForPosition(slot)
      }
    }));
  };

  const canPlay = (player, slot) => {
    return (
      player.primaryPosition === slot ||
      player.secondaryPositions?.includes(slot)
    );
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex bg-gray-900 text-white min-h-screen">

        {/* SPIELFELD */}
        <div className="relative w-[700px] h-[900px] bg-green-700 m-10 rounded-xl overflow-hidden">

          {/* Linien */}
          <div className="absolute inset-0 border-4 border-white"></div>
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

          {/* Slots */}
          {Object.entries(fieldSlots).map(([pos, coords]) => {

            const visible =
              activePlayer &&
              (activePlayer.primaryPosition === pos ||
               activePlayer.secondaryPositions?.includes(pos));

            return (
              <FieldSlot
                key={pos}
                id={pos}
                x={coords.x}
                y={coords.y}
                visible={visible}
              />
            );
          })}

          {/* Spieler auf Feld */}
          {Object.entries(lineup).map(([playerId, data]) => {
            const player = players.find(p => p._id === playerId);
            if (!player) return null;

            return (
              <div
                key={playerId}
                className="absolute bg-white text-black px-2 py-1 rounded text-xs font-bold"
                style={{
                  left: `${data.x}%`,
                  top: `${data.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
              >
                {player.name}
              </div>
            );
          })}

        </div>

        {/* KADER */}
        <div className="w-80 p-6">
          <h2 className="text-lg mb-4 font-bold">Kader</h2>
          {players.map(player => (
            <DraggablePlayer key={player._id} player={player} />
          ))}
        </div>

      </div>
    </DndContext>
  );
}

function FieldSlot({ id, x, y, visible }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  if (!visible) return null;

  return (
    <div
      ref={setNodeRef}
      className={`absolute w-16 h-16 rounded-full border-2 flex items-center justify-center text-xs font-bold
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

function DraggablePlayer({ player }) {
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
      {...listeners}
      {...attributes}
      style={style}
      className="bg-gray-700 p-3 mb-3 rounded cursor-grab"
    >
      <div className="font-semibold">{player.name}</div>
      <div className="text-yellow-400">
        {"⭐".repeat(Math.round(player.starRating || 3))}
      </div>
      <div className="text-xs">{player.primaryPosition}</div>
    </div>
  );
}

function defaultRoleForPosition(pos) {
  const map = {
    ST: "zielspieler",
    RW: "inverser_fluegel",
    LW: "fluegelspieler",
    CM: "box_to_box",
    RB: "offensiver_av",
    LB: "offensiver_av",
    RCB: "klassischer_iv",
    LCB: "klassischer_iv",
    GK: "mitspielender_keeper"
  };
  return map[pos] || null;
}