import { useEffect, useState } from "react";
import {
DndContext,
DragOverlay,
useDraggable,
useDroppable,
defaultDropAnimationSideEffects
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";

/* =====================================================
 SLOT SYSTEM (ENGINE READY)
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

  LST: { x: 35, y: 18 },
  CST: { x: 50, y: 16 },
  RST: { x: 65, y: 18 }
};

const ultraSlots = [
 { id: "GK", zone: "central_box", base: "GK" },
  
  // DEFENSIVE LINE
  { id: "LB", zone: "left_defense_wide", base: "LB" },
  { id: "LCB", zone: "left_defense_half", base: "CB" },
  { id: "CCB", zone: "central_defense", base: "CB" },
  { id: "RCB", zone: "right_defense_half", base: "CB" },
  { id: "RB", zone: "right_defense_wide", base: "RB" },

  // DEFENSIVE MID
  { id: "LDM", zone: "left_halfspace_deep", base: "CDM" },
  { id: "CDM", zone: "central_pivot", base: "CDM" },
  { id: "RDM", zone: "right_halfspace_deep", base: "CDM" },

  // MIDFIELD
  { id: "LCM", zone: "left_halfspace_mid", base: "CM" },
  { id: "CCM", zone: "central_mid", base: "CM" },
  { id: "RCM", zone: "right_halfspace_mid", base: "CM" },

  // ATTACKING MID
  { id: "LAM", zone: "left_halfspace_high", base: "CAM" },
  { id: "CAM", zone: "central_10_space", base: "CAM" },
  { id: "RAM", zone: "right_halfspace_high", base: "CAM" },

  // WING
  { id: "LW", zone: "left_wing_high", base: "WINGER" },
  { id: "RW", zone: "right_wing_high", base: "WINGER" },

  // STRIKERS
  { id: "LST", zone: "left_channel_box", base: "ST" },
  { id: "CST", zone: "central_box", base: "ST" },
  { id: "RST", zone: "right_channel_box", base: "ST" }
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
  GK: ["standard_keeper"],
  WINGER: ["breitspieler", "inverser_fluegel"],
};

/* =====================================================
   ROLE PROFILES (ENGINE CORE)
===================================================== */

const roleProfiles = {
  inverser_aussenverteidiger: {
    basePosition: "LB",
    inPossession: "DM_left_halfspace",
    outOfPossession: "LB",
    buildUp: "double_pivot",
    width: 0.4,
    depth: 0.6
  },

  wingback: {
    basePosition: "RB",
    inPossession: "high_wide_right",
    outOfPossession: "RB",
    buildUp: "wide_progressor",
    width: 0.95,
    depth: 0.75
  },

  ballspielender_verteidiger: {
    basePosition: "CB",
    inPossession: "CB_step_into_midfield",
    outOfPossession: "CB",
    buildUp: "progressive_carrier",
    width: 0.5,
    depth: 0.85
  },

  falsche_9: {
    basePosition: "ST",
    inPossession: "drop_between_lines",
    outOfPossession: "press_central_cb",
    buildUp: "link_player",
    width: 0.5,
    depth: 0.35
  },

  schattenstuermer: {
    basePosition: "CAM",
    inPossession: "arrive_box",
    outOfPossession: "press_dm",
    buildUp: "late_runner",
    width: 0.5,
    depth: 0.4
  }
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

    const cleanId = active.id.replace("field-", "").replace("list-", "");
const player = players.find(p => p._id === cleanId);
    if (!player) return;

    const slot = ultraSlots.find(s => s.id === over.id);

    /* ===== SPIELFELD ===== */

    if (slot) {
      if (!player.positions?.includes(slot.base)) return;

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
  role: roleOptions[slot.base]?.[0] || "default"
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

  const defensiveShape = detectDefensiveLine(lineup);
  const buildUpShape = calculateBuildUpShape(lineup, roleProfiles);
  const overloadMatrix = calculateZoneOverloads(lineup, roleProfiles);
  const teamPower = calculateTeamStrength({
  lineup,
  players,
  defensiveShape,
  buildUpShape,
  overloadMatrix,
  roleProfiles,
  playstyle: team?.tactics
});
const dominance = calculateDominance({
  teamPower,
  overloadMatrix,
  defensiveShape,
  buildUpShape,
  playstyle: team?.tactics
});

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

{/* ===== ENGINE DEBUG PANEL ===== */}

<div className="mt-8 text-xs text-gray-300 bg-black/40 p-4 rounded-xl w-[750px]">
  <div>Defensive Shape: {defensiveShape}</div>
  <div>Build Up Shape: {buildUpShape}</div>
  <div>Left Overload: {overloadMatrix?.left}</div>
  <div>Center Overload: {overloadMatrix?.center}</div>
  <div>Right Overload: {overloadMatrix?.right}</div>

  <hr className="my-3 opacity-30" />

  <div>Attack Power: {teamPower?.attack}</div>
  <div>Defense Power: {teamPower?.defense}</div>
  <div>Control Power: {teamPower?.control}</div>

  <hr className="my-3 opacity-30" />

<div>Possession: {dominance?.possession}%</div>
<div>Chance Creation: {dominance?.chanceCreation}</div>
<div>Pressing: {dominance?.pressing}</div>
<div>Rest Defense: {dominance?.restDefense}</div>
</div>

        </div>
</div>

<DragOverlay dropAnimation={null}>
  {draggingPlayer ? (
    <Circle player={draggingPlayer} />
  ) : null}
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

      {ultraSlots.map(slot => {

        const { setNodeRef } = useDroppable({ id: slot.id });
        const coords = slotCoordinates[slot.id];

        const entry = lineup[slot.id];
        const player = entry
          ? players.find(p => p._id === entry.player)
          : null;

        const valid =
          draggingPlayer &&
          draggingPlayer.positions?.includes(slot.base);

        return (
          <div
            key={slot.id}
            ref={setNodeRef}
            style={{
              position: "absolute",
              left: `${coords.x}%`,
              top: `${coords.y}%`,
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

  const roles = roleOptions[slot.base] || [];

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
    useDraggable({ id: `field-${player._id}` });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab"
      style={{ touchAction: "none" }}
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
    useDraggable({ id: `list-${player._id}` });

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