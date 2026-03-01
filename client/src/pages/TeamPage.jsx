import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";

/* =====================================================
   FORMATIONS
===================================================== */

const formations = {
  "4-3-3": ["GK","LB","LCB","RCB","RB","CDM","LCM","RCM","LW","ST","RW"],
  "4-4-2": ["GK","LB","LCB","RCB","RB","LCM","RCM","LW","RW","LST","RST"],
  "3-5-2": ["GK","LCB","CCB","RCB","CDM","LCM","RCM","LST","RST","LW","RW"]
};

/* =====================================================
   SLOT COORDINATES
===================================================== */

const slotCoordinates = {
  GK:{x:50,y:94},
  LB:{x:10,y:78}, RB:{x:90,y:78},
  LCB:{x:30,y:85}, CCB:{x:50,y:88}, RCB:{x:70,y:85},
  CDM:{x:50,y:68},
  LCM:{x:30,y:55}, RCM:{x:70,y:55},
  LW:{x:15,y:25}, RW:{x:85,y:25},
  ST:{x:50,y:16},
  LST:{x:35,y:18}, RST:{x:65,y:18}
};

/* =====================================================
   DEFAULT TACTICS
===================================================== */

const defaultTactics = {
  playstyle: "ballbesitz",
  pressing: "mittel"
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
  const [tactics,setTactics]=useState(defaultTactics);
  const [roles, setRoles] = useState({});
  const { setNodeRef: setRestRef } = useDroppable({ id: "REST" });

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

  const roleOptions = {
  GK: [
    "Shotstopper",
    "Mitspielender Torwart"
  ],

  LB: [
    "Inverser Außenverteidiger",
    "Halbverteidiger",
    "Wingback",
    "Halbraumspieler"
  ],

  RB: [
    "Inverser Außenverteidiger",
    "Halbverteidiger",
    "Wingback",
    "Halbraumspieler"
  ],

  CB: [
    "Mitspielender Verteidiger",
    "Klassischer Verteidiger"
  ],

  CDM: [
    "Tiefer Spielmacher",
    "Zerstörer",
    "Tiefer 6er"
  ],

  CM: [
    "Spielmacher",
    "Box-to-Box"
  ],

  CAM: [
    "Klassische 10",
    "Schattenstürmer",
    "Halbraumspieler"
  ],

  LW: [
    "Winger",
    "Inverser Flügel"
  ],

  RW: [
    "Winger",
    "Inverser Flügel"
  ],

  ST: [
    "Zielspieler",
    "Falsche 9",
    "Konterstürmer"
  ]
};

  /* ================= AUTO SAVE ================= */

  useEffect(()=>{
    const save=async()=>{
      const token=localStorage.getItem("token");
      await fetch("/api/team/lineup",{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({formation,lineup,bench,tactics,roles})
      });
    };
    save();
  },[formation,lineup,bench,tactics]);

  /* ================= DRAG END ================= */

  const handleDragEnd=(event)=>{
    const {active,over}=event;
    if(!over) return;

    const id=active.id.replace("list-","").replace("field-","");
    const player=players.find(p=>p._id===id);
    if(!player) return;

    /* ===== BENCH SLOT DROP ===== */
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

    /* ===== REST DROP ===== */
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

    /* ===== START11 DROP ===== */

    const slot=over.id;

    let canPlay=false;
    player.positions?.forEach(pos=>{
      if(pos===slot) canPlay=true;

      const basePos=pos.replace("L","").replace("R","");
      const baseSlot=slot.replace("L","").replace("R","");
      if(basePos===baseSlot) canPlay=true;
    });

    if(!canPlay) return;

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

  /* ================= DERIVED LISTS ================= */

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

    {/* TOP BAR */}
    <div className="flex gap-6 mb-6">
      <select
        value={formation}
        onChange={(e)=>{setFormation(e.target.value);setLineup({});}}
        className="bg-gray-800 p-2 rounded"
      >
        {Object.keys(formations).map(f=>
          <option key={f}>{f}</option>
        )}
      </select>

      <select
        value={tactics.playstyle}
        onChange={(e)=>setTactics({...tactics,playstyle:e.target.value})}
        className="bg-gray-800 p-2 rounded"
      >
        <option value="ballbesitz">Ballbesitz</option>
        <option value="konter">Konter</option>
        <option value="mauern">Mauern</option>
      </select>

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

    <div className="flex gap-12">

      {/* PITCH */}
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

      {/* SQUAD */}
      <div className="w-[420px] bg-black/40 p-6 rounded-xl">

        <h3>Startelf ({starters.length}/11)</h3>
        {starters.map(p=>
          <PlayerCard key={p._id} player={p}/>
        )}

        <h3 className="mt-6">Bank</h3>
        {[...Array(7)].map((_,i)=>{
          const slotId=`BENCH-${i}`;
          const {setNodeRef}=useDroppable({id:slotId});
          const playerId=bench[i];
          const player=players.find(p=>p._id===playerId);

          return(
            <div key={slotId} ref={setNodeRef} className="mt-2">
              {player?
                <FieldPlayer player={player}/>:
                <div className="w-14 h-14 border border-white/40 rounded-full"/>
              }
            </div>
          );
        })}

        <h3 className="mt-6">Nicht im Kader</h3>
        <div ref={setRestRef}>
          {restPlayers.map(p=>
            <PlayerCard key={p._id} player={p}/>
          )}
        </div>

      </div>
    </div>
  </div>

  <DragOverlay>
    {dragging && <Circle player={dragging}/>}
  </DragOverlay>

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
      {player.firstName} {player.lastName}
    </div>
  );
}

function FieldPlayer({player, slot, roles, setRoles}) {

  const {attributes,listeners,setNodeRef} =
    useDraggable({id:`field-${player._id}`});

  const basePos = slot.replace("L","").replace("R","");

  return(
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center cursor-grab"
    >
      <Circle player={player}/>

      {/* Rollen Dropdown */}
      <select
        value={roles[slot] || ""}
        onChange={(e)=>
          setRoles(prev=>({...prev,[slot]:e.target.value}))
        }
        className="text-xs mt-1 bg-gray-800 rounded"
      >
        <option value="">Rolle</option>
        {(roleOptions[basePos] || []).map(r=>
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
        <div className="w-14 h-14 border border-white/40 rounded-full"/>
      }
    </div>
  );
}