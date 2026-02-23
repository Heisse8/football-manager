import { useEffect, useState } from "react";

export default function StadiumPage() {
  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchStadium = async () => {
    try {
      const res = await fetch("/api/stadium", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      // Falls kein gültiges Stadion zurückkommt
      if (!data || data.message) {
        setStadium(null);
      } else {
        setStadium(data);
      }

    } catch (err) {
      console.error("Stadium Fehler:", err);
      setStadium(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStadium();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-white">
        Lade Stadion...
      </div>
    );
  }

  if (!stadium) {
    return (
      <div className="p-10 text-white">
        Kein Stadion gefunden.
      </div>
    );
  }

  const construction = stadium.construction || {};

  const totalDuration =
    construction.finishMatchday && construction.startMatchday
      ? construction.finishMatchday - construction.startMatchday
      : 0;

  const remainingMatchdays = stadium.remainingMatchdays || 0;
  const progress = stadium.progress || 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      <h1 className="text-3xl mb-6">
        {stadium.name || "Dein Stadion"}
      </h1>

      <div className="mb-4">
        Kapazität: {stadium.capacity?.toLocaleString()}
      </div>

      {construction.inProgress && (
        <div className="mb-6">

          <div className="mb-2">
            Ausbau auf {construction.targetCapacity?.toLocaleString()}
          </div>

          <div className="w-full bg-gray-700 h-4 rounded">
            <div
              className="bg-green-500 h-4 rounded transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="mt-2 text-sm">
            Noch {remainingMatchdays} Spieltage
          </div>

        </div>
      )}

      <button
        onClick={async () => {
          await fetch("/api/stadium/expand", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchStadium();
        }}
        className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500"
      >
        Stadion erweitern
      </button>

    </div>
  );
}