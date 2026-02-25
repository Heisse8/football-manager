import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";

/* =====================================================
 SLOT SYSTEM (ENGINE READY)
===================================================== */

const fieldSlots = [
  { id: "GK1", type: "GK", x: 50, y: 95 },

  { id: "CB1", type: "CB", x: 30, y: 85 },
  { id: "CB2", type: "CB", x: 50, y: 88 },
  { id: "CB3", type: "CB", x: 70, y: 85 },

  { id: "LWB1", type: "LWB", x: 10, y: 70 },
  { id: "RWB1", type: "RWB", x: 90, y: 70 },

  { id: "CDM1", type: "CDM", x: 30, y: 65 },
  { id: "CDM2", type: "CDM", x: 50, y: 68 },
  { id: "CDM3", type: "CDM", x: 70, y: 65 },

  { id: "CM1", type: "CM", x: 30, y: 55 },
  { id: "CM2", type: "CM", x: 50, y: 55 },
  { id: "CM3", type: "CM", x: 70, y: 55 },

  { id: "CAM1", type: "CAM", x: 30, y: 40 },
  { id: "CAM2", type: "CAM", x: 50, y: 38 },
  { id: "CAM3", type: "CAM", x: 70, y: 40 },

  { id: "ST1", type: "ST", x: 30, y: 18 },
  { id: "ST2", type: "ST", x: 50, y: 16 },
  { id: "ST3", type: "ST", x: 70, y: 18 }
];

/* =====================================================
 ROLLENSYSTEM
===================================================== */

const roleOptions = {
  CB: ["klassischer_innenverteidiger", "ballspielender_verteidiger"],
  LWB: ["wingback", "inverser_aussenverteidiger"],
  RWB: ["wingback", "inverser_aussenverteidiger"],
  CDM: ["tiefer_spielmacher", "zerstoerer", "falsche_6"],
  CM: ["spielmacher", "box_to_box"],
  CAM: ["klassische_10", "schattenstuermer"],
  ST: ["zielspieler", "konterstuermer", "falsche_9"],
  GK: ["standard_keeper"]
};

/* =====================================================
 TEAM PAGE
===================================================== */

export default function TeamPage() {

  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
  const [draggingPlayer, setDraggingPlayer] = useState(null);

  /* ================= LOAD ================= */

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

  /* ================= AUTO SAVE ================= */

  useEffect(() => {
    if (!team) return;

    const token = localStorage.getItem("token");

    fetch("/api/team/lineup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        lineup,
        bench,
        tactics: team.tactics
      })
    });
  }, [lineup, bench, team]);

  /* ================= DRAG END ================= */

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const player = players.find(p => p._id === active.id);
    if (!player) return;

    const slot = fieldSlots.find(s => s.id === over.id);

    /* ===== SPIELFELD ===== */

    if (slot) {
      if (!player.positions?.includes(slot.type)) return;

      setLineup(prev => {
        const updated = { ...prev };

        // Spieler aus allen Slots entfernen
        Object.keys(updated).forEach(key => {
          if (updated[key]?.player === player._id) {
            delete updated[key];
          }
        });

        if (!updated[slot.id] && Object.keys(updated).length >= 11)
          return prev;

        updated[slot.id] = {
          player: player._id,
          role: roleOptions[slot.type]?.[0] || "default"
        };

        return updated;
      });

      setBench(prev => prev.filter(id => id !== player._id));
      return;
    }

    /* ===== BANK ===== */

    if (over.id === "bench") {

      setLineup(prev => {
        const updated = { ...prev };

        Object.keys(updated).forEach(key => {
          if (updated[key]?.player === player._id)
            delete updated[key];
        });

        return updated;
      });

      setBench(prev => {
        if (prev.includes(player._id)) return prev;
        if (prev.length >= 7) return prev;
        return [...prev, player._id];
      });

      return;
    }

    /* ===== REST ===== */

    if (over.id === "rest") {

      setLineup(prev => {
        const updated = { ...prev };

        Object.keys(updated).forEach(key => {
          if (updated[key]?.player === player._id)
            delete updated[key];
        });

        return updated;
      });

      setBench(prev => prev.filter(id => id !== player._id));
    }
  };

  if (!team) return null;

  const starters = Object.values(lineup)
    .map(entry => players.find(p => p._id === entry.player))
    .filter(Boolean);

  const benchPlayers = players.filter(p =>
    bench.includes(p._id)
  );

  const rest = players.filter(p =>
    !starters.includes(p) &&
    !bench.includes(p._id)
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
              setLineup={setLineup}
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
        {draggingPlayer && <Circle player={draggingPlayer} />}
      </DragOverlay>

    </DndContext>
  );
}

/* =====================================================
 PITCH
===================================================== */

function Pitch({ lineup, players, draggingPlayer, setLineup }) {
  return (
    <div className="relative w-[750px] h-[950px] bg-green-700 rounded-xl shadow-2xl">

      <div className="absolute inset-0 border-4 border-white"></div>
      <div className="absolute top-1/2 w-full h-[2px] bg-white"></div>

      {fieldSlots.map(slot => {

        const { setNodeRef } = useDroppable({ id: slot.id });

        const entry = lineup[slot.id];
        const player = entry
          ? players.find(p => p._id === entry.player)
          : null;

        const valid =
          draggingPlayer &&
          draggingPlayer.positions?.includes(slot.type);

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

            {player && (
              <>
                <FieldPlayer player={player} />
                <RoleSelect
                  slot={slot}
                  entry={entry}
                  setLineup={setLineup}
                />
              </>
            )}

            {draggingPlayer && !player && valid && (
              <div className="w-14 h-14 rounded-full border border-white/40 bg-white/10"></div>
            )}

          </div>
        );
      })}
    </div>
  );
}

/* =====================================================
 ROLE SELECT
===================================================== */

function RoleSelect({ slot, entry, setLineup }) {

  const roles = roleOptions[slot.type] || [];

  return (
    <select
      value={entry.role}
      onChange={(e) => {
        setLineup(prev => ({
          ...prev,
          [slot.id]: {
            ...prev[slot.id],
            role: e.target.value
          }
        }));
      }}
      className="mt-1 text-xs bg-gray-800 rounded"
    >
      {roles.map(r => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>
  );
}

/* =====================================================
 FIELD PLAYER
===================================================== */

function FieldPlayer({ player }) {
  const { attributes, listeners, setNodeRef } =
    useDraggable({ id: player._id });

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

/* =====================================================
 CIRCLE
===================================================== */

function Circle({ player }) {
  return (
    <div className="flex flex-col items-center pointer-events-none">
      <div className="w-14 h-14 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-xs font-bold">
        {player.positions[0]}
      </div>
      <div className="text-xs text-white mt-1">
        {player.lastName}
      </div>
    </div>
  );
}

/* =====================================================
 BENCH
===================================================== */

function Bench({ bench }) {

  const { setNodeRef } = useDroppable({ id: "bench" });
  const placeholders = 7 - bench.length;

  return (
    <div
      ref={setNodeRef}
      className="mt-6 w-[750px] bg-black/40 p-4 rounded-xl"
    >
      <h3 className="mb-3 font-semibold">
        Bank ({bench.length}/7)
      </h3>

      <div className="flex gap-3 flex-wrap">
        {bench.map(p => (
          <FieldPlayer key={p._id} player={p} />
        ))}

        {[...Array(placeholders)].map((_, i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-full border border-white/40 bg-white/10"
          />
        ))}
      </div>
    </div>
  );
}

/* =====================================================
 SQUAD LIST
===================================================== */

function SquadList({ starters, benchPlayers, rest }) {

  const { setNodeRef } = useDroppable({ id: "rest" });

  return (
    <div className="w-[420px] bg-black/40 p-6 rounded-xl">

      <Category title="Startelf" players={starters} />
      <Category title="Bank" players={benchPlayers} />

      <div ref={setNodeRef}>
        <Category title="Nicht im Kader" players={rest} />
      </div>

    </div>
  );
}

function Category({ title, players }) {
  return (
    <>
      <h3 className="font-semibold mt-4 mb-2">{title}</h3>
      {players.map(p => (
        <PlayerCard key={p._id} player={p} />
      ))}
    </>
  );
}

/* =====================================================
 PLAYER CARD
===================================================== */

function PlayerCard({ player }) {

  const { attributes, listeners, setNodeRef } =
    useDraggable({ id: player._id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-gray-900 p-3 rounded mb-2 shadow cursor-grab"
    >
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