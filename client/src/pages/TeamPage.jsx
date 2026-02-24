import { useEffect, useState } from "react";

const fieldSlots = {
  GK: { x: 50, y: 92 },
  RB: { x: 78, y: 75 },
  LB: { x: 22, y: 75 },
  RCB: { x: 62, y: 82 },
  LCB: { x: 38, y: 82 },
  DM: { x: 50, y: 65 },
  RCM: { x: 62, y: 55 },
  LCM: { x: 38, y: 55 },
  RW: { x: 80, y: 35 },
  LW: { x: 20, y: 35 },
  ST: { x: 50, y: 25 }
};

export default function TeamPage() {

  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
  const [tactics, setTactics] = useState({});
  const [activePlayer, setActivePlayer] = useState(null);
  const [locked, setLocked] = useState(false);

  // ================= LOAD =================

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
      setTactics(teamData.tactics || {});
      setLocked(teamData.lineupLocked);

      const playersRes = await fetch("/api/player/my-team", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const playersData = await playersRes.json();
      setPlayers(playersData.players || playersData);
    };

    load();
  }, []);

  // ================= AUTO SAVE =================

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

  if (!team) return null;

  // ================= UI =================

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/lockerroom.jpg')" }}
    >
      <div className="bg-black/75 min-h-screen">

        <div className="max-w-[1400px] mx-auto p-6 text-white">

          {/* ================= TACTICS ================= */}
          <div className="grid grid-cols-4 gap-4 mb-8 bg-black/40 p-4 rounded-xl">

            <Select label="Spieltempo" value={tactics.tempo}
              onChange={v => setTactics({ ...tactics, tempo: v })}
              options={["langsam", "normal", "hoch", "sehr_hoch"]} />

            <Select label="Mentalität" value={tactics.mentality}
              onChange={v => setTactics({ ...tactics, mentality: v })}
              options={["defensiv", "ausgewogen", "offensiv", "sehr_offensiv"]} />

            <Select label="Spielidee" value={tactics.style}
              onChange={v => setTactics({ ...tactics, style: v })}
              options={["ballbesitz", "konter", "gegenpressing", "mauern"]} />

            <Select label="Passspiel" value={tactics.passing}
              onChange={v => setTactics({ ...tactics, passing: v })}
              options={["kurz", "variabel", "lang"]} />

            <Select label="Abwehrlinie" value={tactics.defensiveLine}
              onChange={v => setTactics({ ...tactics, defensiveLine: v })}
              options={["tief", "mittel", "hoch"]} />

            <Select label="Pressing" value={tactics.pressing}
              onChange={v => setTactics({ ...tactics, pressing: v })}
              options={["niedrig", "mittel", "hoch"]} />

            <Select label="Breite (Ballbesitz)" value={tactics.width}
              onChange={v => setTactics({ ...tactics, width: v })}
              options={["schmal", "normal", "breit"]} />

            <Select label="Ballverlust" value={tactics.transitionAfterLoss}
              onChange={v => setTactics({ ...tactics, transitionAfterLoss: v })}
              options={["gegenpressing", "zurueckziehen"]} />

          </div>

          {/* ================= MAIN LAYOUT ================= */}

          <div className="flex gap-10">

            {/* SPIELFELD + BANK */}
            <div className="flex flex-col items-center w-[750px]">

              <Pitch
                lineup={lineup}
                players={players}
                activePlayer={activePlayer}
                setActivePlayer={setActivePlayer}
                setLineup={setLineup}
              />

              <Bench
                bench={bench}
                players={players}
                setBench={setBench}
              />

            </div>

            {/* KADER */}
            <SquadList
              players={players}
              lineup={lineup}
              bench={bench}
              setActivePlayer={setActivePlayer}
            />

          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= PITCH ================= */

function Pitch({ lineup, players, activePlayer, setActivePlayer, setLineup }) {

  return (
    <div className="relative w-[700px] h-[900px] bg-green-700 rounded-xl overflow-hidden shadow-2xl">

      {/* Linien */}
      <div className="absolute inset-0 border-4 border-white"></div>
      <div className="absolute top-1/2 w-full h-[2px] bg-white"></div>

      {/* 16er */}
      <div className="absolute top-0 left-1/2 w-80 h-40 border-2 border-white -translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/2 w-80 h-40 border-2 border-white -translate-x-1/2"></div>

      {/* 5m Räume */}
      <div className="absolute top-0 left-1/2 w-32 h-16 border-2 border-white -translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/2 w-32 h-16 border-2 border-white -translate-x-1/2"></div>

      {Object.entries(fieldSlots).map(([pos, coords]) => {

        const playerId = Object.keys(lineup).find(id => lineup[id] === pos);
        const player = players.find(p => p._id === playerId);

        const visible =
          activePlayer &&
          (activePlayer.primaryPosition === pos ||
            activePlayer.secondaryPositions?.includes(pos));

        return (
          <div
            key={pos}
            className="absolute text-center"
            style={{
              left: `${coords.x}%`,
              top: `${coords.y}%`,
              transform: "translate(-50%, -50%)"
            }}
          >
            {visible && (
              <div className="w-12 h-12 bg-yellow-400/80 rounded-full mb-1"></div>
            )}

            <div
              onClick={() => player && setActivePlayer(player)}
              className="bg-white text-black px-2 py-1 rounded text-xs font-bold"
            >
              {player ? player.name : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= BENCH ================= */

function Bench({ bench, players }) {
  return (
    <div className="mt-6 w-full bg-black/40 p-4 rounded-xl">
      <h3 className="mb-3 font-semibold">Bank (7 Plätze)</h3>
      <div className="grid grid-cols-7 gap-3">
        {[...Array(7)].map((_, i) => {
          const player = players.find(p => p._id === bench[i]);
          return (
            <div
              key={i}
              className="h-16 bg-gray-800 rounded flex items-center justify-center text-xs"
            >
              {player ? player.name : "—"}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= SQUAD ================= */

function SquadList({ players, lineup, bench, setActivePlayer }) {

  const startingIds = Object.keys(lineup);
  const benchIds = bench;

  const starters = players.filter(p => startingIds.includes(p._id));
  const benchPlayers = players.filter(p => benchIds.includes(p._id));
  const rest = players.filter(
    p => !startingIds.includes(p._id) && !benchIds.includes(p._id)
  );

  return (
    <div className="w-[400px] bg-black/40 p-6 rounded-xl">

      <Category title="Startelf" players={starters} setActivePlayer={setActivePlayer} />
      <Category title="Bank" players={benchPlayers} setActivePlayer={setActivePlayer} />
      <Category title="Nicht im Kader" players={rest} setActivePlayer={setActivePlayer} />

    </div>
  );
}

function Category({ title, players, setActivePlayer }) {
  return (
    <>
      <h3 className="font-semibold mt-4 mb-2">{title}</h3>
      {players.map(p => (
        <div
          key={p._id}
          onClick={() => setActivePlayer(p)}
          className="bg-gray-800 p-2 mb-2 rounded cursor-pointer hover:bg-gray-700"
        >
          {p.name} ({p.age}) ⭐{p.starRating}
        </div>
      ))}
    </>
  );
}

/* ================= SELECT ================= */

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <div className="text-xs mb-1">{label}</div>
      <select
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-800 p-2 rounded"
      >
        <option value="">-</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}