import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";

/* =====================================================
   FORMATIONS (ALLE)
===================================================== */

const formations = {
  "4-3-3": ["GK","LB","LCB","RCB","RB","CDM","LCM","RCM","LW","ST","RW"],

  // LW/RW breiter
  "4-4-2": ["GK","LB","LCB","RCB","RB","LCM","RCM","LW","RW","LST","RST"],

  // LW/RW gleiche Höhe wie CAM
  "4-2-3-1": ["GK","LB","LCB","RCB","RB","LCDM","RCDM","LW","CAM","RW","ST"],

  // LW/RW gleiche Höhe wie LZOM/RZOM
  "4-1-4-1": ["GK","LB","LCB","RCB","RB","CDM","LZOM","RZOM","LW","RW","ST"],

  "4-1-2-1-2": ["GK","LB","LCB","RCB","RB","CDM","LCM","RCM","CAM","LST","RST"],

  "3-4-3": ["GK","LCB","CCB","RCB","LWB","RWB","LCM","RCM","LW","ST","RW"],

  "3-5-2": ["GK","LCB","CCB","RCB","LWB","RWB","CDM","LCM","RCM","LST","RST"],

  "5-4-1": ["GK","LCB","CCB","RCB","LWB","RWB","LCM","RCM","LW","RW","ST"],

  "3-4-2-1": ["GK","LCB","CCB","RCB","LWB","RWB","LCM","RCM","LZOM","RZOM","ST"]
};

/* =====================================================
   SLOT POSITIONEN
===================================================== */

const slotCoordinates = {
  GK:{x:50,y:96},

  // Viererkette
  LB:{x:12,y:82}, RB:{x:88,y:82},
  LCB:{x:30,y:90}, CCB:{x:50,y:92}, RCB:{x:70,y:90},

  // Wingbacks
  LWB:{x:10,y:72},
  RWB:{x:90,y:72},

  // Doppel‑6
  LCDM:{x:40,y:70},
  RCDM:{x:60,y:70},
  CDM:{x:50,y:70},

  // ZM
  LCM:{x:35,y:58},
  RCM:{x:65,y:58},

  // 4‑1‑4‑1 offensive 8er
  LZOM:{x:35,y:48},
  RZOM:{x:65,y:48},

  // ZOM zentral
  CAM:{x:50,y:48},

  // -------- FLÜGEL --------

  // 4‑3‑3 → höher
  LW:{x:18,y:28},
  RW:{x:82,y:28},

  // Sturm
  ST:{x:50,y:16},
  LST:{x:38,y:18},
  RST:{x:62,y:18}
};

/* =====================================================
   ROLLEN
===================================================== */

const roleOptions = {
  GK:["Shotstopper","Mitspielender Torwart"],
  LB:["Inverser AV","Wingback"],
  RB:["Inverser AV","Wingback"],
  LWB:["Wingback"],
  RWB:["Wingback"],
  LCB:["Mitspielender IV","Klassischer IV"],
  CCB:["Mitspielender IV","Klassischer IV"],
  RCB:["Mitspielender IV","Klassischer IV"],
  CDM:["Zerstörer","Tiefer Spielmacher"],
  LCM:["Spielmacher","Box-to-Box"],
  RCM:["Spielmacher","Box-to-Box"],
  CAM:["Klassische 10","Schattenstürmer"],
  LW:["Winger","Inverser Flügel"],
  RW:["Winger","Inverser Flügel"],
  ST:["Zielspieler","Falsche 9","Konterstürmer"],
  LST:["Zielspieler","Konterstürmer"],
  RST:["Zielspieler","Konterstürmer"]
};

/* =====================================================
   TEAM PAGE
===================================================== */

export default function TeamPage(){

  const [formation,setFormation]=useState("4-3-3");
  const [players,setPlayers]=useState([]);
  const [lineup,setLineup]=useState({});
  const [bench,setBench]=useState(Array(7).fill(null));
  const [dragging,setDragging]=useState(null);
  const [roles,setRoles]=useState({});
  const [tactics,setTactics]=useState({
    playstyle:"ballbesitz",
    pressing:"mittel"
  });

  const { setNodeRef:setRestRef }=useDroppable({id:"REST"});

  /* ================= LOAD ================= */

  useEffect(()=>{
    const load=async()=>{
      const token=localStorage.getItem("token");
      const res=await fetch("/api/player/my-team",{
        headers:{Authorization:`Bearer ${token}`}
      });
      setPlayers(await res.json());
    };
    load();
  },[]);

  /* ================= DRAG ================= */

  const handleDragEnd=(event)=>{
    const {active,over}=event;
    if(!over) return;

    const id=active.id.replace("list-","").replace("field-","");
    const player=players.find(p=>p._id===id);
    if(!player) return;

    if(over.id.startsWith("BENCH-")){
      const index=parseInt(over.id.split("-")[1]);

      setLineup(prev=>{
        const updated={...prev};
        Object.keys(updated).forEach(k=>{
          if(updated[k]===player._id) delete updated[k];
        });
        return updated;
      });

      setBench(prev=>{
        const updated=[...prev];
        updated[index]=player._id;
        return updated;
      });
      return;
    }

    if(over.id==="REST"){
      setLineup(prev=>{
        const updated={...prev};
        Object.keys(updated).forEach(k=>{
          if(updated[k]===player._id) delete updated[k];
        });
        return updated;
      });
      setBench(prev=>prev.map(id=>id===player._id?null:id));
      return;
    }

    const slot=over.id;

    setLineup(prev=>{
      const updated={...prev};
      Object.keys(updated).forEach(k=>{
        if(updated[k]===player._id) delete updated[k];
      });
      updated[slot]=player._id;
      return updated;
    });

    setBench(prev=>prev.map(id=>id===player._id?null:id));
  };

  /* ================= DERIVED ================= */

  const starters=Object.values(lineup)
    .map(id=>players.find(p=>p._id===id))
    .filter(Boolean);

  const benchPlayers=bench
    .map(id=>players.find(p=>p._id===id))
    .filter(Boolean);

  const restPlayers=players.filter(p=>
    !starters.includes(p) &&
    !bench.includes(p._id)
  );

  return(
  <DndContext
    onDragStart={(e)=>{
      const id=e.active.id.replace("list-","").replace("field-","");
      setDragging(players.find(p=>p._id===id));
    }}
    onDragEnd={(e)=>{
      handleDragEnd(e);
      setDragging(null);
    }}
  >

  <div className="max-w-[1500px] mx-auto p-6 text-white">

  {/* ===== TOP BAR MIT ÜBERSCHRIFTEN ===== */}

  <div className="flex gap-8 mb-8">

    <div>
      <label className="block text-sm mb-2 font-semibold">Formation</label>
      <select
        value={formation}
        onChange={(e)=>{setFormation(e.target.value);setLineup({});}}
        className="bg-gray-800 p-2 rounded"
      >
        {Object.keys(formations).map(f=>
          <option key={f}>{f}</option>
        )}
      </select>
    </div>

    <div>
      <label className="block text-sm mb-2 font-semibold">Spielidee</label>
      <select
        value={tactics.playstyle}
        onChange={(e)=>setTactics({...tactics,playstyle:e.target.value})}
        className="bg-gray-800 p-2 rounded"
      >
        <option value="ballbesitz">Ballbesitz</option>
        <option value="konter">Konter</option>
        <option value="mauern">Mauern</option>
      </select>
    </div>

    <div>
      <label className="block text-sm mb-2 font-semibold">Pressing</label>
      <select
        value={tactics.pressing}
        onChange={(e)=>setTactics({...tactics,pressing:e.target.value})}
        className="bg-gray-800 p-2 rounded"
      >
        <option value="sehr_hoch">Sehr hoch</option>
        <option value="hoch">Hoch</option>
        <option value="mittel">Mittel</option>
        <option value="tief">Tief</option>
      </select>
    </div>

  </div>

  <div className="flex gap-12">

  {/* SPIELFELD */}
  <div className="flex flex-col">

  <div className="relative w-[750px] h-[950px] bg-green-700 rounded-xl border-4 border-white">

  {formations[formation].map((slot,index)=>{
    const coords=slotCoordinates[slot];
    if(!coords) return null;

    const player=players.find(p=>p._id===lineup[slot]);

    return(
      <PitchSlot
        key={slot+index}
        id={slot}
        coords={coords}
        player={player}
        roles={roles}
        setRoles={setRoles}
      />
    );
  })}

  </div>

  {/* BANK */}
  <div className="mt-6 bg-black/40 p-4 rounded-xl w-[750px]">
    <h3 className="mb-3 font-semibold">Auswechselbank</h3>
    <div className="flex gap-4">
      {[...Array(7)].map((_,i)=>{
        const slotId=`BENCH-${i}`;
        const {setNodeRef}=useDroppable({id:slotId});
        const playerId=bench[i];
        const player=players.find(p=>p._id===playerId);

        return(
          <div key={slotId} ref={setNodeRef}>
            {player?
              <Circle player={player}/>
              :
              <div className="w-14 h-14 border border-white/40 rounded-full flex items-center justify-center text-xs">
                Bank
              </div>
            }
          </div>
        );
      })}
    </div>
  </div>

  </div>

  {/* RECHTE SEITE */}
  <div className="w-[420px] bg-black/40 p-6 rounded-xl">

  <h3 className="font-semibold mb-2">
    Startelf ({starters.length}/11)
  </h3>

  {starters.map(p=>
    <PlayerCard key={p._id} player={p}/>
  )}

  <h3 className="mt-6 font-semibold">
    Auswechselbank
  </h3>

  {benchPlayers.map(p=>
    <PlayerCard key={p._id} player={p}/>
  )}

  <h3 className="mt-6 font-semibold">
    Nicht im Kader
  </h3>

  <div ref={setRestRef}>
    {restPlayers.map(p=>
      <PlayerCard key={p._id} player={p}/>
    )}
  </div>

  </div>

  </div>

  <DragOverlay>
    {dragging && <Circle player={dragging}/>}
  </DragOverlay>

  </div>
  </DndContext>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function PlayerCard({player}){
  const {attributes,listeners,setNodeRef}=useDraggable({id:`list-${player._id}`});
  return(
    <div ref={setNodeRef} {...listeners} {...attributes}
      className="bg-gray-900 p-3 rounded mb-2 cursor-grab">

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

function PitchSlot({id,coords,player,roles,setRoles}){
  const {setNodeRef}=useDroppable({id});

  return(
    <div
      ref={setNodeRef}
      style={{
        position:"absolute",
        left:`${coords.x}%`,
        top:`${coords.y}%`,
        transform:"translate(-50%,-50%)"
      }}
    >
      {player?
        <FieldPlayer
          player={player}
          slot={id}
          roles={roles}
          setRoles={setRoles}
        />
        :
        <div className="w-14 h-14 border border-white/40 rounded-full flex items-center justify-center text-xs">
          {id}
        </div>
      }
    </div>
  );
}

function FieldPlayer({player,slot,roles,setRoles}){
  const {attributes,listeners,setNodeRef}=
    useDraggable({id:`field-${player._id}`});

  return(
    <div ref={setNodeRef} {...listeners} {...attributes}
      className="flex flex-col items-center cursor-grab">

      <Circle player={player}/>

      <select
        value={roles[slot]||""}
        onChange={(e)=>setRoles(prev=>({...prev,[slot]:e.target.value}))}
        className="text-xs mt-1 bg-gray-800 rounded"
      >
        <option value="">Rolle</option>
        {(roleOptions[slot]||[]).map(r=>
          <option key={r}>{r}</option>
        )}
      </select>

    </div>
  );
}

function Circle({player}){
  return(
    <div className="w-14 h-14 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-xs">
      {player.positions[0]}
    </div>
  );
}