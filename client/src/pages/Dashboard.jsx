import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import bgImage from "../assets/manager-office.jpg";

export default function Dashboard() {
  const teamName = "FC Manager";
  const budget = 12500000;

  const lastMatch = {
    opponent: "Dynamo City",
    result: "2:1",
    scorer: "Müller",
  };

  const latestTransfer = {
    player: "Carlos Mendes",
    fee: "8 Mio €",
  };

  const injury = {
    player: "Leon Bauer",
    weeks: 3,
  };

  const table = [
    "FC Bayern", "Borussia Dortmund", "RB Leipzig",
    "Bayer Leverkusen", "Eintracht Frankfurt",
    "VfB Stuttgart", teamName,
    "Union Berlin", "SC Freiburg",
    "TSG Hoffenheim", "Werder Bremen",
    "FC Augsburg", "Mainz 05",
    "Borussia M'Gladbach", "VfL Wolfsburg",
    "1. FC Köln", "Bochum", "Darmstadt"
  ];

  const newsPool = [
    {
      headline: `${latestTransfer.player} für ${latestTransfer.fee}!`,
      sub: `${teamName} schlägt brutal zu!`,
      text: `${teamName} verpflichtet ${latestTransfer.player}.`,
      image: "https://picsum.photos/1200/600?random=1",
    },
    {
      headline: `${lastMatch.result}-SIEG!`,
      sub: `Drama gegen ${lastMatch.opponent}!`,
      text: `Treffer von ${lastMatch.scorer} bringt den Sieg.`,
      image: "https://picsum.photos/1200/600?random=2",
    },
    {
      headline: `SCHOCK! ${injury.player} fällt aus!`,
      sub: `${injury.weeks} Wochen Pause`,
      text: `Verletzung im Training bestätigt.`,
      image: "https://picsum.photos/1200/600?random=3",
    },
    {
      headline: "Sponsor erhöht Budget!",
      sub: "Neue Millionen fließen",
      text: "Ein neuer Hauptsponsor sorgt für frische Einnahmen.",
      image: "https://picsum.photos/1200/600?random=4",
    },
    {
      headline: "Gerüchte um Top‑Talent",
      sub: "Scouts arbeiten intensiv",
      text: "Ein junges Talent steht auf der Wunschliste.",
      image: "https://picsum.photos/1200/600?random=5",
    },
  ];

  const [mainNews, setMainNews] = useState(null);
  const [sideNews, setSideNews] = useState([]);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    let slot = null;
    if (hour >= 6 && hour < 12) slot = "morning";
    else if (hour >= 12 && hour < 18) slot = "noon";
    else if (hour >= 18) slot = "evening";
    else slot = "night";

    const savedSlot = localStorage.getItem("newsSlot");

    if (savedSlot !== slot) {
      const shuffled = [...newsPool].sort(() => 0.5 - Math.random());
      const main = shuffled[0];
      const small = shuffled.slice(1, 4);

      setMainNews(main);
      setSideNews(small);

      localStorage.setItem("newsSlot", slot);
      localStorage.setItem("mainNews", JSON.stringify(main));
      localStorage.setItem("sideNews", JSON.stringify(small));
    } else {
      setMainNews(JSON.parse(localStorage.getItem("mainNews")));
      setSideNews(JSON.parse(localStorage.getItem("sideNews")));
    }
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90"></div>

      <div className="relative z-10">

        <header className="bg-black/50 backdrop-blur-md p-6 flex justify-between items-center border-b border-white/10">
          <h1 className="text-3xl font-bold">{teamName}</h1>
          <div className="text-xl text-yellow-400 font-semibold">
            💰 {budget.toLocaleString()} €
          </div>
        </header>

        <main className="grid grid-cols-4 gap-6 p-8 max-w-[1800px] mx-auto">

          {/* TABELLE */}
          <div className="col-span-1 bg-black/50 backdrop-blur-md rounded-xl p-5">
            <h2 className="font-bold mb-4">Tabelle</h2>
            <div className="space-y-1 text-sm">
              {table.map((club, index) => (
                <div
                  key={index}
                  className={`flex justify-between px-2 py-1 rounded ${
                    club === teamName
                      ? "bg-yellow-500 text-black font-bold"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span>{index + 1}. {club}</span>
                  <span>{Math.floor(Math.random() * 50)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NEWS */}
          <div className="col-span-2 bg-black/50 backdrop-blur-md rounded-xl overflow-hidden">

            {mainNews && (
              <>
                <div className="bg-red-600 px-6 py-3 font-extrabold uppercase animate-pulse">
                  BREAKING – BILD
                </div>

                <div className="relative">
                  <img src={mainNews.image} className="w-full h-96 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-4xl font-extrabold">
                      {mainNews.headline}
                    </h2>
                    <p className="text-xl text-yellow-300 mt-2">
                      {mainNews.sub}
                    </p>
                  </div>
                </div>

                <div className="bg-white text-black p-6">
                  {mainNews.text}
                </div>
              </>
            )}

            {/* 3 KLEINE NEWS */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-black/30">
              {sideNews.map((news, i) => (
                <div key={i} className="bg-black/50 rounded-lg overflow-hidden hover:scale-105 transition">
                  <img src={news.image} className="h-32 w-full object-cover" />
                  <div className="p-3 text-sm">
                    <div className="font-bold">{news.headline}</div>
                    <div className="opacity-70 text-xs mt-1">
                      {news.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* NÄCHSTES SPIEL */}
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