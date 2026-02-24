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
  const [bench, setBench] = useState([]);
  const [activePlayer, setActivePlayer] = useState(null);

  const [tactics, setTactics] = useState({
    playStyle: "ballbesitz",
    tempo: "kontrolliert",
    mentality: "ausgewogen",
    pressing: "mittel",
    defensiveLine: "mittel"
  });

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

  const start11 = players.filter(p => lineup[p._id]);
  const notInSquad = players.filter(
    p => !lineup[p._id] && !bench.includes(p._id)
  );

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

      {/* 🔥 Hintergrund */}
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/lockerroom.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <div className="relative z-10 flex flex-col text-white min-h-screen p-8">

          {/* ================= Taktik Panel ================= */}
          <div className="bg-black/50 p-4 rounded-xl mb-6 flex gap-6 flex-wrap">
            <TacticSelect label="Spielidee" value={tactics.playStyle}
              options={["ballbesitz","konter","gegenpressing","mauern"]}
              onChange={(v)=>setTactics({...tactics, playStyle:v})}
            />
            <TacticSelect label="Tempo" value={tactics.tempo}
              options={["langsam","kontrolliert","hoch","sehr_hoch"]}
              onChange={(v)=>setTactics({...tactics, tempo:v})}
            />
            <TacticSelect label="Mentalität" value={tactics.mentality}
              options={["defensiv","ausgewogen","offensiv","sehr_offensiv"]}
              onChange={(v)=>setTactics({...tactics, mentality:v})}
            />
            <TacticSelect label="Pressing" value={tactics.pressing}
              options={["mittel","hoch","sehr_hoch","low_block"]}
              onChange={(v)=>setTactics({...tactics, pressing:v})}
            />
            <TacticSelect label="Abwehrlinie" value={tactics.defensiveLine}
              options={["tief","mittel","hoch"]}
              onChange={(v)=>setTactics({...tactics, defensiveLine:v})}
            />
          </div>

          <div className="flex gap-10">

            {/* ================= Spielfeld ================= */}
            <div className="relative w-[700px] h-[900px] bg-green-700/90 rounded-xl overflow-hidden shadow-2xl">

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

              {/* Startelf */}
              {Object.entries(lineup).map(([playerId, data]) => {
                const player = players.find(p => p._id === playerId);
                if (!player) return null;

                return (
                  <div
                    key={playerId}
                    className="absolute bg-white text-black px-3 py-2 rounded text-xs shadow-lg w-32"
                    style={{
                      left: `${data.x}%`,
                      top: `${data.y}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                  >
                    <div className="font-bold">{player.name}</div>
                    <div className="text-[10px] opacity-70">
                      {player.primaryPosition} • {player.age} Jahre
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================= Kader ================= */}
            <div className="w-96 bg-black/40 backdrop-blur-md p-6 rounded-xl">
              <Section title="Startelf">
                {start11.map(p =>
                  <DraggablePlayer key={p._id} player={p} />
                )}
              </Section>

              <Section title="Auswechselbank">
                {bench.map(id => {
                  const player = players.find(p => p._id === id);
                  if (!player) return null;
                  return <DraggablePlayer key={id} player={player} />;
                })}
              </Section>

              <Section title="Nicht im Kader">
                {notInSquad.map(p =>
                  <DraggablePlayer key={p._id} player={p} />
                )}
              </Section>
            </div>
          </div>

          {/* ================= Bank unter Spielfeld ================= */}
          <div className="mt-6 bg-black/50 p-4 rounded-xl flex gap-4">
            <h3 className="font-bold mr-4">Auswechselbank:</h3>
            {bench.map(id => {
              const player = players.find(p => p._id === id);
              if (!player) return null;
              return (
                <div key={id} className="bg-gray-800 px-3 py-2 rounded text-xs">
                  {player.name}
                </div>
              );
            })}
          </div>

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
      className={`absolute w-16 h-16 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all
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
      className="bg-gray-800 p-3 mb-3 rounded cursor-grab hover:bg-gray-700 transition shadow"
    >
      <div className="font-semibold">{player.name}</div>
      <div className="text-yellow-400">
        {"⭐".repeat(Math.round(player.starRating || 3))}
      </div>
      <div className="text-xs opacity-70">
        {player.primaryPosition} • {player.age} Jahre
      </div>
    </div>
  );
}

function TacticSelect({ label, options, value, onChange }) {
  return (
    <div>
      <div className="text-xs mb-1 opacity-70">{label}</div>
      <select
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="bg-gray-800 p-2 rounded text-sm"
      >
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-sm opacity-80">{title}</h3>
      <div className="space-y-2">{children}</div>
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