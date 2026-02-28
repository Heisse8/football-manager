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
  "4-4-2": ["GK","LB","LCB","RCB","RB","LCM","RCM","LW","RW","LST","RST"],
  "4-2-3-1": ["GK","LB","LCB","RCB","RB","LDM","RDM","CAM","LW","RW","ST"],
  "4-3-3": ["GK","LB","LCB","RCB","RB","CDM","LCM","RCM","LW","RW","ST"],
  "4-1-4-1": ["GK","LB","LCB","RCB","RB","CDM","LAM","RAM","LW","RW","ST"],
  "4-1-2-1-2": ["GK","LB","LCB","RCB","RB","CDM","LCM","RCM","CAM","LST","RST"],
  "3-4-3": ["GK","LCB","CCB","RCB","LB","RB","LCM","RCM","LW","RW","ST"],
  "3-4-2-1": ["GK","LCB","CCB","RCB","LB","RB","LCM","RCM","LAM","RAM","ST"],
  "3-5-2": ["GK","LCB","CCB","RCB","LB","RB","CDM","LCM","RCM","LST","RST"]
};

/* =====================================================
   POSITION GROUPS
===================================================== */

const positionGroups = {
  ST: ["LST","ST","RST"],
  CAM: ["LAM","CAM","RAM"],
  CM: ["LCM","CCM","RCM"],
  CDM: ["LDM","CDM","RDM"],
  CB: ["LCB","CCB","RCB"],
  LB: ["LB"],
  RB: ["RB"],
  LW: ["LW"],
  RW: ["RW"],
  GK: ["GK"]
};

/* =====================================================
   SLOT COORDINATES
===================================================== */

const slotCoordinates = {
  GK:{x:50,y:95},

  LB:{x:10,y:80}, LCB:{x:30,y:85}, CCB:{x:50,y:88}, RCB:{x:70,y:85}, RB:{x:90,y:80},

  LDM:{x:30,y:65}, CDM:{x:50,y:68}, RDM:{x:70,y:65},

  LCM:{x:30,y:55}, CCM:{x:50,y:55}, RCM:{x:70,y:55},

  LAM:{x:30,y:40}, CAM:{x:50,y:38}, RAM:{x:70,y:40},

  LW:{x:15,y:25}, RW:{x:85,y:25},

  LST:{x:35,y:18}, ST:{x:50,y:16}, RST:{x:65,y:18}
};

/* =====================================================
   TEAM PAGE
===================================================== */

export default function TeamPage() {

  const [formation,setFormation]=useState("4-3-3");
  const [players,setPlayers]=useState([]);
  const [lineup,setLineup]=useState({});
  const [draggingPlayer,setDraggingPlayer]=useState(null);

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

  const handleDragEnd=(event)=>{
    const {active,over}=event;
    if(!over) return;

    const cleanId=active.id.replace("field-","").replace("list-","");
    const player=players.find(p=>p._id===cleanId);
    if(!player) return;

    const slotId=over.id;

    if(!formations[formation].includes(slotId)) return;

    const canPlay=player.positions?.some(pos =>
      positionGroups[pos]?.includes(slotId)
    );

    if(!canPlay) return;

    setLineup(prev=>{
      const updated={...prev};

      Object.keys(updated).forEach(k=>{
        if(updated[k]===player._id) delete updated[k];
      });

      if(Object.keys(updated).length>=11 && !updated[slotId])
        return prev;

      updated[slotId]=player._id;
      return updated;
    });
  };

  return(
    <DndContext
      onDragStart={(event)=>{
        const id=event.active.id.replace("field-","").replace("list-","");
        setDraggingPlayer(players.find(p=>p._id===id));
      }}
      onDragEnd={(event)=>{
        handleDragEnd(event);
        setDraggingPlayer(null);
      }}
    >
      <div className="max-w-[1500px] mx-auto p-6 text-white">

        {/* Formation Selector */}
        <select
          value={formation}
          onChange={(e)=>{
            setFormation(e.target.value);
            setLineup({});
          }}
          className="bg-gray-800 p-2 rounded mb-6"
        >
          {Object.keys(formations).map(f=>(
            <option key={f}>{f}</option>
          ))}
        </select>

        <div className="flex gap-12">

          {/* PITCH */}
          <div className="relative w-[750px] h-[950px] bg-green-700 rounded-xl shadow-2xl">

            {/* Linien */}
            <div className="absolute inset-0 border-4 border-white"></div>
            <div className="absolute top-1/2 w-full h-[3px] bg-white"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 border-4 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-60 border-4 border-white transform -translate-x-1/2"></div>
            <div className="absolute top-0 left-1/2 w-96 h-60 border-4 border-white transform -translate-x-1/2"></div>

            {formations[formation].map(slotId=>(
              <Slot
                key={slotId}
                slotId={slotId}
                coords={slotCoordinates[slotId]}
                player={players.find(p=>p._id===lineup[slotId])}
              />
            ))}

          </div>

          {/* Squad */}
          <div className="w-[420px] bg-black/40 p-6 rounded-xl overflow-y-auto h-[950px]">
            {players.map(p=>(
              <PlayerCard key={p._id} player={p}/>
            ))}
          </div>

        </div>
      </div>

      <DragOverlay>
        {draggingPlayer && <Circle player={draggingPlayer}/>}
      </DragOverlay>

    </DndContext>
  );
}

/* =====================================================
   SLOT
===================================================== */

function Slot({slotId,coords,player}){

  const {setNodeRef}=useDroppable({id:slotId});
  if(!coords) return null;

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
      {player
        ? <FieldPlayer player={player}/>
        : <div className="w-14 h-14 rounded-full border-2 border-white/40 bg-white/10"/>
      }
    </div>
  );
}

/* =====================================================
   PLAYER CARD
===================================================== */

function PlayerCard({player}){
  const {attributes,listeners,setNodeRef}=useDraggable({
    id:`list-${player._id}`
  });

  return(
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-gray-900 p-3 rounded mb-2 cursor-grab"
    >
      {player.firstName} {player.lastName}
      <div className="text-xs text-gray-400">
        {player.positions.join(", ")}
      </div>
    </div>
  );
}

function FieldPlayer({player}){
  const {attributes,listeners,setNodeRef}=useDraggable({
    id:`field-${player._id}`
  });

  return(
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <Circle player={player}/>
    </div>
  );
}

function Circle({player}){
  return(
    <div className="w-14 h-14 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-xs font-bold">
      {player.positions[0]}
    </div>
  );
}