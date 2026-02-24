import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

/* =====================================================
   POSITIONEN AUF DEM FELD
===================================================== */

const fieldSlots = {
  GK: { x: 50, y: 92 },
  RB: { x: 80, y: 75 },
  RCB: { x: 65, y: 82 },
  LCB: { x: 35, y: 82 },
  LB: { x: 20, y: 75 },

  DM: { x: 50, y: 65 },
  RCM: { x: 65, y: 55 },
  LCM: { x: 35, y: 55 },

  RW: { x: 80, y: 35 },
  ST: { x: 50, y: 25 },
  LW: { x: 20, y: 35 },
};

/* =====================================================
   TEAM PAGE
===================================================== */

export default function TeamPage() {

  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
  const [team, setTeam] = useState(null);
  const [activePlayer, setActivePlayer] = useState(null);

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

      const playerRes = await fetch("/api/player/my-team", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const playerData = await playerRes.json();
      setPlayers(playerData);
    };

    load();
  }, []);

  /* ================= AUTO SAVE ================= */

  useEffect(() => {
    if (!team) return;

    const save = async () => {
      const token = localStorage.getItem("token");

      await fetch("/api/team/lineup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ lineup, bench })
      });
    };

    save();
  }, [lineup, bench]);

  /* ================= DRAG LOGIK ================= */

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

    if (!player) return;

    // Slot auf Feld
    if (fieldSlots[slot]) {
      setLineup(prev => ({
        ...prev,
        [player._id]: {
          position: slot,
          role: defaultRoleForPosition(slot),
          x: fieldSlots[slot].x,
          y: fieldSlots[slot].y
        }
      }));

      setBench(prev => prev.filter(id => id !== player._id));
    }

    // Auf Bank
    if (slot === "bench") {
      setBench(prev => [...new Set([...prev, player._id])]);

      setLineup(prev => {
        const copy = { ...prev };
        delete copy[player._id];
        return copy;
      });
    }
  };

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Lade Team...
      </div>
    );
  }

  const start11Ids = Object.keys(lineup);
  const benchIds = bench;

  const start11 = players.filter(p => start11Ids.includes(p._id));
  const benchPlayers = players.filter(p => benchIds.includes(p._id));
  const notInSquad = players.filter(
    p => !start11Ids.includes(p._id) && !benchIds.includes(p._id)
  );

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/lockerroom.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <div className="relative z-10 p-10 text-white">

          {/* ================= SPIELFELD ================= */}
          <div className="flex gap-12">

            <div className="relative w-[700px] h-[900px] bg-green-700/90 rounded-xl shadow-2xl overflow-hidden">

              {/* Linien */}
              <div className="absolute inset-0 border-4 border-white"></div>
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white"></div>
              <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

              {/* Slots */}
              {Object.entries(fieldSlots).map(([pos, coords]) => (
                <FieldSlot key={pos} id={pos} x={coords.x} y={coords.y} />
              ))}

              {/* Spieler auf Feld */}
              {start11.map(player => {
                const data = lineup[player._id];
                return (
                  <div
                    key={player._id}
                    className="absolute bg-white text-black px-2 py-1 rounded text-xs font-bold"
                    style={{
                      left: `${data.x}%`,
                      top: `${data.y}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                  >
                    {player.name}
                    <div className="text-[10px] opacity-60">
                      {data.role}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================= KADER ================= */}
            <div className="w-80 bg-black/40 backdrop-blur-md p-6 rounded-xl">

              <Section title="Startelf">
                {start11.map(p => <PlayerCard key={p._id} player={p} />)}
              </Section>

              <Section title="Bank" droppableId="bench">
                {benchPlayers.map(p => <PlayerCard key={p._id} player={p} />)}
              </Section>

              <Section title="Nicht im Kader">
                {notInSquad.map(p => <PlayerCard key={p._id} player={p} />)}
              </Section>

            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

/* =====================================================
   KOMPONENTEN
===================================================== */

function FieldSlot({ id, x, y }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`absolute w-16 h-16 rounded-full border-2 flex items-center justify-center text-xs font-bold transition
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

function PlayerCard({ player }) {
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
      className="bg-gray-800 p-3 mb-3 rounded cursor-grab hover:bg-gray-700 transition"
    >
      <div className="font-semibold">{player.name}</div>
      <div className="text-xs opacity-70">
        {player.primaryPosition} | {player.age} Jahre
      </div>
      <div className="text-yellow-400">
        {"⭐".repeat(Math.round(player.starRating || 3))}
      </div>
    </div>
  );
}

function Section({ title, children, droppableId }) {

  const droppable = droppableId ? useDroppable({ id: droppableId }) : null;

  return (
    <div
      ref={droppable ? droppable.setNodeRef : null}
      className="mb-6"
    >
      <h2 className="font-bold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function defaultRoleForPosition(pos) {
  const map = {
    ST: "zielspieler",
    RW: "inverser_fluegel",
    LW: "fluegelspieler",
    DM: "tiefer_spielmacher",
    RCM: "box_to_box",
    LCM: "box_to_box",
    RB: "wingback",
    LB: "wingback",
    RCB: "klassischer_iv",
    LCB: "klassischer_iv",
    GK: "mitspielender_keeper"
  };
  return map[pos] || null;
}