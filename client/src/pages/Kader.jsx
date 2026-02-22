import { useEffect, useState } from "react";

const formations = {
  "4-4-2": [
    { role: "GK", x: 525, y: 600 },
    { role: "LB", x: 150, y: 480 },
    { role: "CB", x: 375, y: 480 },
    { role: "CB", x: 675, y: 480 },
    { role: "RB", x: 900, y: 480 },
    { role: "LM", x: 150, y: 340 },
    { role: "CM", x: 425, y: 340 },
    { role: "CM", x: 625, y: 340 },
    { role: "RM", x: 900, y: 340 },
    { role: "ST", x: 425, y: 180 },
    { role: "ST", x: 625, y: 180 }
  ]
};

export default function Kader() {
  const [team, setTeam] = useState(null);
  const [lineup, setLineup] = useState({});
  const currentFormation = "4-4-2";

  useEffect(() => {
    fetch("http://localhost:3000/api/team")
      .then(res => res.json())
      .then(data => {
        const loadedTeam = data[0];
        setTeam(loadedTeam);

        const initialLineup = {};
        loadedTeam.players.slice(0, 11).forEach((player, i) => {
          initialLineup[i] = player._id;
        });
        setLineup(initialLineup);
      });
  }, []);

  if (!team) return <div className="text-white">Lade Team...</div>;

  const formation = formations[currentFormation];

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[1100px] aspect-[105/68] relative">

        <svg
          viewBox="0 0 1050 680"
          className="absolute inset-0 w-full h-full rounded-xl shadow-2xl"
        >
          {/* Rasen */}
          <rect width="1050" height="680" fill="#1f7a34" />

          {/* Außenlinie */}
          <rect
            x="10"
            y="10"
            width="1030"
            height="660"
            fill="none"
            stroke="white"
            strokeWidth="6"
            rx="20"
          />

          {/* Mittellinie */}
          <line x1="10" y1="340" x2="1040" y2="340" stroke="white" strokeWidth="4" />

          {/* Mittelkreis */}
          <circle cx="525" cy="340" r="90" fill="none" stroke="white" strokeWidth="4" />
          <circle cx="525" cy="340" r="6" fill="white" />

          {/* Strafräume */}
          <rect x="325" y="10" width="400" height="150" fill="none" stroke="white" strokeWidth="4" />
          <rect x="325" y="520" width="400" height="150" fill="none" stroke="white" strokeWidth="4" />

          {/* 5er */}
          <rect x="425" y="10" width="200" height="70" fill="none" stroke="white" strokeWidth="4" />
          <rect x="425" y="600" width="200" height="70" fill="none" stroke="white" strokeWidth="4" />

          {/* Elfmeterpunkte */}
          <circle cx="525" cy="150" r="5" fill="white" />
          <circle cx="525" cy="530" r="5" fill="white" />

        </svg>

        {/* ================= SPIELER ================= */}
        {formation.map((slot, index) => {
          const player = team.players.find(p => p._id === lineup[index]);

          return (
            <div
              key={index}
              className="absolute flex flex-col items-center"
              style={{
                left: `${(slot.x / 1050) * 100}%`,
                top: `${(slot.y / 680) * 100}%`,
                transform: "translate(-50%, -50%)"
              }}
            >
              <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-xl shadow-lg border border-gray-300">
                <span className="text-2xl font-bold text-red-600">
                  {index + 1}
                </span>
              </div>

              <div className="mt-2 bg-black text-white text-xs px-3 py-1 rounded-full">
                {player?.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}