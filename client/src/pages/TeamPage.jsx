import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

/* =========================================================
   POSITION SLOTS (nur sichtbar wenn Spieler aktiv)
========================================================= */

const fieldSlots = {
  GK: { x: 50, y: 92 },
  LB: { x: 20, y: 75 },
  LCB: { x: 40, y: 80 },
  RCB: { x: 60, y: 80 },
  RB: { x: 80, y: 75 },
  DM: { x: 50, y: 65 },
  LCM: { x: 35, y: 55 },
  RCM: { x: 65, y: 55 },
  LW: { x: 20, y: 35 },
  RW: { x: 80, y: 35 },
  ST: { x: 50, y: 25 }
};

/* =========================================================
   TEAM PAGE
========================================================= */

export default function TeamPage() {

  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
  const [tactics, setTactics] = useState({});
  const [locked, setLocked] = useState(false);
  const [activePlayer, setActivePlayer] = useState(null);

  /* ================= LOAD ================= */

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");

      const teamRes = await fetch("/api/team", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const teamData = await teamRes.json();

      if (!teamRes.ok) return;

      setTeam(teamData);
      setLineup(teamData.lineup || {});
      setBench(teamData.bench || []);
      setTactics(teamData.tactics || {});
      setLocked(teamData.lineupLocked);

      const playersRes = await fetch("/api/player/my-team", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const playersData = await playersRes.json();
      setPlayers(playersData);
    };

    load();
  }, []);

  /* ================= AUTOSAVE ================= */

  useEffect(() => {
    if (!team || locked) return;

    const save = async () => {
      const token = localStorage.getItem("token");

      await fetch("/api/team/lineup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ lineup, bench, tactics })
      });
    };

    save();
  }, [lineup, bench, tactics]);

  /* ================= DRAG ================= */

  const handleDragStart = (event) => {
    const player = players.find(p => p._id === event.active.id);
    setActivePlayer(player);
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    setActivePlayer(null);
    if (!over) return;

    const player = players.find(p => p._id === active.id);
    if (!player) return;

    const slot = over.id;

    if (!canPlay(player, slot)) return;

    setLineup(prev => ({
      ...prev,
      [player._id]: {
        position: slot,
        x: fieldSlots[slot].x,
        y: fieldSlots[slot].y
      }
    }));
  };

  const canPlay = (player, slot) => {
    return (
      player.primaryPosition === slot ||
      player.secondaryPositions?.includes(slot)
    );
  };

  /* ================= SORTING ================= */

  const start11Ids = Object.keys(lineup);
  const benchIds = bench;

  const start11 = players.filter(p => start11Ids.includes(p._id));
  const benchPlayers = players.filter(p => benchIds.includes(p._id));
  const notSelected = players.filter(
    p => !start11Ids.includes(p._id) && !benchIds.includes(p._id)
  );

  if (!team) return null;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/lockerroom.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

        <div className="relative z-10 p-8 text-white">

          {/* ================= MANAGER SETTINGS ================= */}

          <div className="grid grid-cols-6 gap-4 mb-6 bg-black/50 p-4 rounded-xl">

            <Select label="Spieltempo" value={tactics.tempo} onChange={(v)=>setTactics({...tactics, tempo:v})}
              options={["langsam","normal","hoch","sehr_hoch"]} />

            <Select label="Mentalität" value={tactics.mentality}
              onChange={(v)=>setTactics({...tactics, mentality:v})}
              options={["defensiv","ausgewogen","offensiv","sehr_offensiv"]} />

            <Select label="Spielidee" value={tactics.style}
              onChange={(v)=>setTactics({...tactics, style:v})}
              options={["ballbesitz","konter","gegenpressing","mauern"]} />

            <Select label="Passspiel"
              value={tactics.passing}
              onChange={(v)=>setTactics({...tactics, passing:v})}
              options={["kurz","variabel","lang"]} />

            <Select label="Abwehrlinie"
              value={tactics.defensiveLine}
              onChange={(v)=>setTactics({...tactics, defensiveLine:v})}
              options={["tief","normal","hoch"]} />

            <Select label="Pressing"
              value={tactics.pressing}
              onChange={(v)=>setTactics({...tactics, pressing:v})}
              options={["passiv","mittel","aggressiv"]} />

          </div>

          {/* ================= LAYOUT ================= */}

          <div className="flex gap-10">

            {/* ================= SPIELFELD ================= */}

            <div className="relative w-[650px] h-[900px] bg-green-700/95 rounded-xl shadow-2xl overflow-hidden">

              {/* Linien */}
              <div className="absolute inset-0 border-4 border-white"></div>
              <div className="absolute top-1/2 w-full h-[2px] bg-white"></div>
              <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>

              {/* 16er */}
              <div className="absolute bottom-0 left-1/2 w-64 h-40 border-2 border-white -translate-x-1/2"></div>
              <div className="absolute top-0 left-1/2 w-64 h-40 border-2 border-white -translate-x-1/2"></div>

              {/* 5m Raum */}
              <div className="absolute bottom-0 left-1/2 w-32 h-20 border-2 border-white -translate-x-1/2"></div>
              <div className="absolute top-0 left-1/2 w-32 h-20 border-2 border-white -translate-x-1/2"></div>

              {/* Slots nur bei Auswahl */}
              {activePlayer &&
                Object.entries(fieldSlots).map(([pos, coords]) => {

                  if (!canPlay(activePlayer, pos)) return null;

                  return (
                    <FieldSlot key={pos} id={pos} x={coords.x} y={coords.y}/>
                  );
                })
              }

              {/* Spieler */}
              {Object.entries(lineup).map(([id, data]) => {
                const player = players.find(p => p._id === id);
                if (!player) return null;

                return (
                  <div
                    key={id}
                    className="absolute bg-white text-black px-2 py-1 rounded text-xs font-bold shadow"
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

            {/* ================= KADER ================= */}

            <div className="w-80 bg-black/50 p-4 rounded-xl">

              <Category title="Startelf" players={start11}/>
              <Category title="Bank (7 Plätze)" players={benchPlayers}/>
              <Category title="Nicht im Kader" players={notSelected}/>

            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function FieldSlot({ id, x, y }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="absolute w-16 h-16 rounded-full bg-white/60 flex items-center justify-center text-xs font-bold"
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

function Category({ title, players }) {
  return (
    <div className="mb-6">
      <h3 className="font-bold mb-2">{title}</h3>
      {players.map(p => (
        <DraggablePlayer key={p._id} player={p}/>
      ))}
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
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-gray-800 p-3 mb-2 rounded cursor-grab hover:bg-gray-700 transition"
    >
      <div className="font-semibold">{player.name}</div>
      <div className="text-xs opacity-70">
        {player.age} Jahre | {player.primaryPosition}
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
        onChange={(e)=>onChange(e.target.value)}
        className="w-full bg-gray-800 p-2 rounded"
      >
        <option value="">-</option>
        {options.map(o=>(
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}