import { useEffect, useState } from "react";

/* =====================================================
 SLOT POSITIONEN
===================================================== */

const slotCoordinates = {
  GK:{x:50,y:96},

  LB:{x:12,y:82}, RB:{x:88,y:82},
  LCB:{x:30,y:90}, CCB:{x:50,y:92}, RCB:{x:70,y:90},

  LWB:{x:10,y:72}, RWB:{x:90,y:72},

  LCDM:{x:40,y:70}, RCDM:{x:60,y:70}, CDM:{x:50,y:70},

  LCM:{x:35,y:58}, RCM:{x:65,y:58},

  LZOM:{x:35,y:48}, RZOM:{x:65,y:48},
  CAM:{x:50,y:48},

  LW:{x:18,y:28}, RW:{x:82,y:28},

  ST:{x:50,y:16},
  LST:{x:38,y:18}, RST:{x:62,y:18}
};

export default function TeamPage(){

  const [team,setTeam]=useState(null);
  const [players,setPlayers]=useState([]);
  const [manager,setManager]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  useEffect(()=>{
    const load=async()=>{
      try{
        const token=localStorage.getItem("token");

        if(!token){
          setError("Nicht eingeloggt.");
          setLoading(false);
          return;
        }

        /* ===== TEAM ===== */
        const teamRes=await fetch("/api/team",{
          headers:{Authorization:`Bearer ${token}`}
        });

        if(!teamRes.ok){
          throw new Error("Team konnte nicht geladen werden");
        }

        const teamData=await teamRes.json();
        setTeam(teamData);

        /* ===== SPIELER ===== */
        const playerRes=await fetch("/api/player/my-team",{
          headers:{Authorization:`Bearer ${token}`}
        });

        if(!playerRes.ok){
          throw new Error("Spieler konnten nicht geladen werden");
        }

        const playerData=await playerRes.json();
        setPlayers(Array.isArray(playerData) ? playerData : []);

        /* ===== MANAGER ===== */
        const managerRes=await fetch("/api/manager/my",{
          headers:{Authorization:`Bearer ${token}`}
        });

        if(!managerRes.ok){
          throw new Error("Manager konnte nicht geladen werden");
        }

        const managerData=await managerRes.json();
        setManager(managerData);

        setLoading(false);

      }catch(err){
        console.error("TeamPage Fehler:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    load();
  },[]);

  /* ================= STATES ================= */

  if(loading){
    return (
      <div className="p-10 text-white">
        Lade Team...
      </div>
    );
  }

  if(error){
    return (
      <div className="p-10 text-red-500">
        {error}
      </div>
    );
  }

  if(!team || !manager){
    return (
      <div className="p-10 text-gray-400">
        Kein Team oder Manager gefunden.
      </div>
    );
  }

  const formation = manager.formation;
  const lineup = team.lockedLineup || {};
  const bench = team.lockedBench || [];

  return(
  <div className="max-w-[1500px] mx-auto p-6 text-white">

    {/* ===== HEADER ===== */}
    <div className="flex justify-between mb-8">

      <div>
        <h2 className="text-2xl font-bold">
          {team.name}
        </h2>
        <p className="text-gray-400">
          Trainer: {manager.age} Jahre • {"★".repeat(Math.round(manager.rating))}
        </p>
      </div>

      <div className="text-right">
        <p className="font-semibold">Formation</p>
        <p className="text-xl">{formation}</p>
        <p className="text-sm text-gray-400 mt-1">
          Stil: {manager.playstyle}
        </p>
      </div>

    </div>

    <div className="flex gap-12">

      {/* SPIELFELD */}
      <div className="flex flex-col">

        <div className="relative w-[750px] h-[950px] bg-green-700 rounded-xl border-4 border-white">

          {/* MITTELLINIE */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white -translate-y-1/2"></div>

          {/* MITTELKREIS */}
          <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>

          {/* 16ER + 5ER */}
          <div className="absolute top-0 left-1/2 w-[60%] h-[160px] border-2 border-white -translate-x-1/2"></div>
          <div className="absolute top-0 left-1/2 w-[30%] h-[70px] border-2 border-white -translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-[60%] h-[160px] border-2 border-white -translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-[30%] h-[70px] border-2 border-white -translate-x-1/2"></div>

          {/* STARTELF */}
          {Object.keys(lineup).map(slot=>{
            const coords=slotCoordinates[slot];
            if(!coords) return null;

            const player=players.find(p=>p._id===lineup[slot]);
            if(!player) return null;

            return(
              <div
                key={slot}
                style={{
                  position:"absolute",
                  left:`${coords.x}%`,
                  top:`${coords.y}%`,
                  transform:"translate(-50%,-50%)"
                }}
                className="flex flex-col items-center text-center"
              >
                <Circle player={player}/>
                <div className="text-xs mt-1 font-semibold">
                  {player.lastName}
                </div>
                <div className="text-yellow-400 text-xs">
                  {"★".repeat(Math.round(player.stars))}
                </div>
              </div>
            );
          })}

        </div>

        {/* BANK */}
        <div className="mt-6 bg-black/40 p-4 rounded-xl w-[750px]">
          <h3 className="mb-3 font-semibold">Auswechselbank</h3>
          <div className="flex gap-4">
            {bench.map(id=>{
              const player=players.find(p=>p._id===id);
              if(!player) return null;
              return <Circle key={id} player={player}/>;
            })}
          </div>
        </div>

      </div>

      {/* RECHTE SEITE */}
      <div className="w-[420px] bg-black/40 p-6 rounded-xl">

        <h3 className="font-semibold mb-4">
          Startelf
        </h3>

        {Object.values(lineup).map(id=>{
          const p=players.find(pl=>pl._id===id);
          if(!p) return null;
          return <PlayerCard key={p._id} player={p}/>;
        })}

        <h3 className="mt-6 font-semibold">
          Auswechselbank
        </h3>

        {bench.map(id=>{
          const p=players.find(pl=>pl._id===id);
          if(!p) return null;
          return <PlayerCard key={p._id} player={p}/>;
        })}

      </div>

    </div>
  </div>
  );
}

/* =====================================================
 COMPONENTS
===================================================== */

function PlayerCard({player}){
  return(
    <div className="bg-gray-900 p-3 rounded mb-2">
      <div className="font-semibold">
        {player.firstName} {player.lastName}
      </div>
      <div className="text-xs text-gray-400">
        {player.age} Jahre • {player.positions?.join(", ")}
      </div>
      <div className="text-yellow-400 text-xs">
        {"★".repeat(Math.round(player.stars))}
      </div>
    </div>
  );
}

function Circle({player}){
  return(
    <div className="w-14 h-14 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-xs">
      {player.positions?.[0] || ""}
    </div>
  );
}