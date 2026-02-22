import { useEffect, useState } from "react";
import bgImage from "../assets/manager-office.jpg";

export default function Dashboard() {
  const [teamName, setTeamName] = useState("");
  const [table, setTable] = useState([]);

  const budget = 12500000;

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://football-manager-z7rr.onrender.com/api/team",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.name) {
          setTeamName(data.name.trim());
        }

        // Demo Tabelle
        setTable([
          "FC Bayern",
          "Borussia Dortmund",
          "RB Leipzig",
          "Bayer Leverkusen",
          "Eintracht Frankfurt",
          "VfB Stuttgart",
          data.name || "Dein Team",
          "Union Berlin",
          "SC Freiburg",
          "TSG Hoffenheim",
          "Werder Bremen",
          "FC Augsburg",
          "Mainz 05",
          "Borussia M'Gladbach",
          "VfL Wolfsburg",
          "1. FC Köln",
          "Bochum",
          "Darmstadt",
        ]);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/50 backdrop-blur-md p-6 flex justify-between items-center border-b border-white/10">
          <h1 className="text-3xl font-bold">{teamName}</h1>
          <div className="text-xl text-yellow-400 font-semibold">
            💰 {budget.toLocaleString()} €
          </div>
        </header>

        <main className="grid grid-cols-4 gap-6 p-8 max-w-[1800px] mx-auto">
          {/* Tabelle */}
          <div className="col-span-1 bg-black/50 backdrop-blur-md rounded-xl p-5">
            <h2 className="font-bold mb-4">Tabelle</h2>

            <div className="space-y-1 text-sm">
              {table.map((club, index) => {
                const isMyTeam =
                  club?.toLowerCase().trim() ===
                  teamName?.toLowerCase().trim();

                return (
                  <div
                    key={index}
                    className={`flex justify-between items-center px-3 py-2 rounded transition ${
                      isMyTeam
                        ? "bg-green-600/30 border-l-4 border-green-400 font-semibold"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <span>
                      {index + 1}. {club}
                    </span>

                    <span>{Math.floor(Math.random() * 50)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mittelbereich (Platzhalter) */}
          <div className="col-span-2 bg-black/50 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Manager News</h2>
            <p className="opacity-80">
              Willkommen zurück, Manager. Dein Verein entwickelt sich
              hervorragend!
            </p>
          </div>

          {/* Nächstes Spiel */}
          <div className="col-span-1 bg-black/50 backdrop-blur-md rounded-xl p-5">
            <h2 className="font-bold mb-4">Nächste Begegnung</h2>
            <div className="text-center bg-black/30 p-6 rounded-lg">
              <div>12.03.2026</div>
              <div className="text-2xl font-bold my-3">{teamName}</div>
              <div>vs</div>
              <div className="text-2xl font-bold my-3">SV Online</div>
              <div className="text-yellow-400">Heimspiel</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}