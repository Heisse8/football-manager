import { useEffect, useState } from "react";

export default function StadiumPage() {

  const [stadium, setStadium] = useState(null);
  const token = localStorage.getItem("token");

  const fetchStadium = async () => {
    const res = await fetch("/api/stadium", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setStadium(data);
  };

  useEffect(() => {
    fetchStadium();
  }, []);

  if (!stadium) return null;

  const remaining =
    stadium.construction.finishMatchday
      ? stadium.construction.finishMatchday - stadium.construction.startMatchday
      : 0;

  const progress =
    stadium.construction.inProgress
      ? ((stadium.construction.finishMatchday -
          stadium.construction.startMatchday -
          remaining) /
          (stadium.construction.finishMatchday -
            stadium.construction.startMatchday)) *
        100
      : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      <h1 className="text-3xl mb-6">
        {stadium.name || "Dein Stadion"}
      </h1>

      <div className="mb-4">
        Kapazität: {stadium.capacity.toLocaleString()}
      </div>

      {stadium.construction.inProgress && (
        <div className="mb-6">

          <div className="mb-2">
            Ausbau auf {stadium.construction.targetCapacity.toLocaleString()}
          </div>

          <div className="w-full bg-gray-700 h-4 rounded">
            <div
              className="bg-green-500 h-4 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="mt-2 text-sm">
            Fertig an Spieltag {stadium.construction.finishMatchday}
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
        className="bg-blue-600 px-6 py-2 rounded"
      >
        Stadion erweitern
      </button>

    </div>
  );
}