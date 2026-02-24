import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

export default function TeamPage() {

  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
  const [tactics, setTactics] = useState({});
  const [locked, setLocked] = useState(false);

  /* ================= LOAD DATA ================= */

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

  /* ================= AUTO SAVE ================= */

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
        body: JSON.stringify({
          lineup,
          bench,
          tactics
        })
      });
    };

    save();
  }, [lineup, bench, tactics]);

  /* ================= SYSTEM PREVIEW ================= */

  const systemPreview = generateSystemPreview(lineup, players);

  if (!team) return null;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/lockerroom.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative z-10 p-8 text-white">

        {locked && (
          <div className="bg-red-600 p-3 rounded mb-4">
            Lineup gesperrt für diesen Spieltag
          </div>
        )}

        {/* ===== System Analyse ===== */}
        <div className="bg-black/50 p-4 rounded-xl mb-6">
          <div>Im Aufbau: {systemPreview.buildUp}</div>
          <div>Gegen den Ball: {systemPreview.defensive}</div>
          <div>Final Line Pressure: {systemPreview.pressure}</div>
        </div>

        {/* ===== Taktik Panel ===== */}
        <TacticPanel tactics={tactics} setTactics={setTactics} disabled={locked} />

      </div>
    </div>
  );
}