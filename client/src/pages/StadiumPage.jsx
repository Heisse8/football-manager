import { useEffect, useState } from "react";
import bgImage from "../assets/stadium-construction.jpg";

const expansionConfig = {
  2000: { next: 4000, cost: 750000, duration: 8 },
  4000: { next: 8000, cost: 1800000, duration: 14 },
  8000: { next: 16000, cost: 4000000, duration: 22 },
  16000: { next: 32000, cost: 9000000, duration: 34 },
  32000: { next: 64000, cost: 22000000, duration: 60 },
  64000: { next: 81365, cost: 45000000, duration: 100 }
};

export default function StadiumPage() {

  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketPrice, setTicketPrice] = useState(15);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  const token = localStorage.getItem("token");

  const fetchStadium = async () => {
    const res = await fetch("/api/stadium", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setStadium(data);
    setTicketPrice(data.ticketPrice);
    setLoading(false);
  };

  useEffect(() => {
    fetchStadium();
  }, []);

  // 🔥 LIVE COUNTDOWN
  useEffect(() => {
    if (!stadium?.construction?.finishDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const finish = new Date(stadium.construction.finishDate);
      const total = finish - now;

      if (total <= 0) {
        setRemainingTime(null);
        fetchStadium();
        return;
      }

      const weeks = Math.floor(total / (1000 * 60 * 60 * 24 * 7));
      const days = Math.floor((total / (1000 * 60 * 60 * 24)) % 7);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((total / (1000 * 60)) % 60);

      setRemainingTime({ weeks, days, hours, minutes });

    }, 1000);

    return () => clearInterval(interval);

  }, [stadium]);

  if (loading || !stadium) {
    return <div className="p-10 text-white">Lade Stadion...</div>;
  }

  const construction = stadium.construction || {};
  const nextStage = expansionConfig[stadium.capacity];

  // Nachfrage-Simulation
  const baseDemand = 0.75;
  const priceFactor =
    ticketPrice <= 20 ? 1 :
    ticketPrice <= 35 ? 0.9 :
    ticketPrice <= 50 ? 0.75 : 0.6;

  const estimatedAttendance = Math.floor(
    stadium.capacity * baseDemand * priceFactor
  );

  const estimatedRevenue = estimatedAttendance * ticketPrice;

  return (
    <div className="relative min-h-screen text-white">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 p-10 max-w-6xl mx-auto">

        {/* STADIONNAME */}
        <h1 className="text-4xl font-bold mb-4">
          {stadium.name || "Dein Stadion"}
        </h1>

        {!stadium.nameLocked && (
          <div className="mb-8 flex gap-3">
            <input
              type="text"
              placeholder="Stadionname festlegen (einmalig)"
              className="px-3 py-2 text-black rounded w-64"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              disabled={!newName || saving}
              onClick={async () => {
                setSaving(true);
                await fetch("/api/stadium/set-name", {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({ name: newName })
                });
                setSaving(false);
                fetchStadium();
              }}
              className="bg-yellow-500 text-black px-4 py-2 rounded disabled:opacity-50"
            >
              Festlegen
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT COLUMN */}
          <div className="bg-black/60 p-6 rounded-xl backdrop-blur-md">

            <h2 className="text-xl mb-4 font-semibold">
              Stadion Übersicht
            </h2>

            <div className="space-y-2">
              <div>Kapazität: <b>{stadium.capacity.toLocaleString()}</b></div>
              <div>Ticketpreis: <b>{ticketPrice} €</b></div>
              <div>Geschätzte Auslastung: <b>{estimatedAttendance.toLocaleString()}</b></div>
              <div>Geschätzte Einnahmen: <b>{estimatedRevenue.toLocaleString()} €</b></div>
            </div>

            {/* Ticketpreis */}
            <div className="mt-6">
              <label className="block mb-2">Ticketpreis einstellen</label>
              <input
                type="range"
                min="5"
                max="60"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full"
              />

              <button
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  await fetch("/api/stadium/ticket-price", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ price: ticketPrice })
                  });
                  setSaving(false);
                  fetchStadium();
                }}
                className="mt-3 bg-yellow-500 text-black px-4 py-2 rounded disabled:opacity-50"
              >
                Speichern
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="bg-black/60 p-6 rounded-xl backdrop-blur-md">

            <h2 className="text-xl mb-4 font-semibold">
              Stadion Ausbau
            </h2>

            {construction.inProgress && remainingTime ? (
              <>
                <div className="mb-3">
                  Ausbau auf {construction.targetCapacity?.toLocaleString()}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 h-4 rounded">
                  <div
                    className="bg-green-500 h-4 rounded transition-all"
                    style={{ width: `${stadium.progress || 0}%` }}
                  />
                </div>

                <div className="mt-4 text-lg font-semibold">
                  ⏳ {remainingTime.weeks} Wochen  
                  {remainingTime.days} Tage  
                  {remainingTime.hours}h  
                  {remainingTime.minutes}m
                </div>
              </>
            ) : nextStage ? (
              <>
                <div>Nächste Stufe: <b>{nextStage.next.toLocaleString()} Plätze</b></div>
                <div>Kosten: <b>{nextStage.cost.toLocaleString()} €</b></div>
                <div>
                  Bauzeit: <b>{Math.ceil(nextStage.duration / 2)} Wochen</b>
                </div>

                <button
                  disabled={saving}
                  onClick={async () => {
                    setSaving(true);
                    await fetch("/api/stadium/expand", {
                      method: "POST",
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    setSaving(false);
                    fetchStadium();
                  }}
                  className="mt-4 bg-blue-600 px-6 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
                >
                  Ausbau starten
                </button>
              </>
            ) : (
              <div>Maximale Stadiongröße erreicht.</div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}