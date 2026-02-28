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
  "4-3-3": ["GK","LB","LCB","RCB","RB","CDM","LCM","RCM","LW","ST","RW"],
  "4-1-4-1": ["GK","LB","LCB","RCB","RB","CDM","LCM","RCM","LW","RW","ST"],
  "4-1-2-1-2": ["GK","LB","LCB","RCB","RB","CDM","LCM","RCM","CAM","LST","RST"],
  "3-4-3": ["GK","LCB","CCB","RCB","LB","RB","LCM","RCM","LW","ST","RW"],
  "3-5-2": ["GK","LCB","CCB","RCB","LB","RB","CDM","LCM","RCM","LST","RST"]
};

/* =====================================================
   POSITION GROUPS
===================================================== */

const positionGroups = {
  ST: ["LST","ST","RST"],
  CAM: ["CAM"],
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
   ROLES
===================================================== */

const roleOptions = {
  GK: ["shotstopper","mitspielender_torwart"],
  LB: ["wingback","inverser_ausenverteidiger","halbverteidiger","halbraumspieler"],
  RB: ["wingback","inverser_ausenverteidiger","halbverteidiger","halbraumspieler"],
  CB: ["ballspielender_verteidiger","klassischer_verteidiger"],
  CDM: ["tiefer_spielmacher","zerstoerer","tiefe_6"],
  CM: ["box_to_box","spielmacher"],
  CAM: ["klassische_10","schattenstuermer"],
  LW: ["winger","inverser_fluegel"],
  RW: ["winger","inverser_fluegel"],
  ST: ["zielspieler","falsche_9","konter_stuermer"]
};

/* =====================================================
   SLOT COORDINATES
===================================================== */

const slotCoordinates = {
  GK:{x:50,y:94},
  LB:{x:10,y:78}, RB:{x:90,y:78},
  LCB:{x:30,y:85}, CCB:{x:50,y:88}, RCB:{x:70,y:85},
  LDM:{x:30,y:65}, CDM:{x:50,y:68}, RDM:{x:70,y:65},
  LCM:{x:30,y:55}, CCM:{x:50,y:55}, RCM:{x:70,y:55},
  CAM:{x:50,y:38},
  LW:{x:15,y:25}, RW:{x:85,y:25},
  LST:{x:35,y:18}, ST:{x:50,y:16}, RST:{x:65,y:18}
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
  const [bench,setBench]=useState([]);
  const [roles,setRoles]=useState({});
  const [dragging,setDragging]=useState(null);
  const [tactics,setTactics]=useState(defaultTactics);

  useEffect(()=>{
    const load=async()=>{
      const token=localStorage.getItem("token");
      const res=await fetch("/api/player/my-team",{headers:{Authorization:`Bearer ${token}`}});
      setPlayers(await res.json());
    };
    load();
  },[]);

  const handleDragEnd=(event)=>{
    const {active,over}=event;
    if(!over)return;

    const id=active.id.replace("list-","").replace("field-","");
    const player=players.find(p=>p._id===id);
    if(!player)return;

    const slot=over.id;

    const canPlay=player.positions?.some(pos=>
      positionGroups[pos]?.includes(slot)
    );
    if(!canPlay)return;

    setLineup(prev=>{
      const updated={...prev};

      Object.keys(updated).forEach(k=>{
        if(updated[k]===player._id)delete updated[k];
      });

      if(Object.keys(updated).length>=11 && !updated[slot])return prev;

      updated[slot]=player._id;
      return updated;
    });
  };

  const starters=Object.values(lineup)
    .map(id=>players.find(p=>p._id===id))
    .filter(Boolean);

  const benchPlayers=bench
    .map(id=>players.find(p=>p._id===id))
    .filter(Boolean);

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

          <div>
            <label className="block text-sm mb-2">Formation</label>
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
            <label className="block text-sm mb-2">Spielidee</label>
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
            <label className="block text-sm mb-2">Pressing</label>
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

          {/* PITCH */}
          <div className="flex flex-col">

            <div className="relative w-[750px] h-[950px] bg-green-700 rounded-xl shadow-2xl border-4 border-white">

              <div className="absolute top-1/2 w-full h-[2px] bg-white"></div>
              <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>

              {/* 16er & 5er */}
              <div className="absolute top-0 left-1/2 w-[60%] h-40 border-2 border-white -translate-x-1/2"></div>
              <div className="absolute top-0 left-1/2 w-[30%] h-20 border-2 border-white -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-[60%] h-40 border-2 border-white -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-[30%] h-20 border-2 border-white -translate-x-1/2"></div>

              {formations[formation].map((slot,index)=>{
                const coords=slotCoordinates[slot];
                if(!coords)return null;

                const {setNodeRef}=useDroppable({id:slot});
                const player=players.find(p=>p._id===lineup[slot]);

                return(
                  <div
                    key={slot+index}
                    ref={setNodeRef}
                    style={{
                      position:"absolute",
                      left:`${coords.x}%`,
                      top:`${coords.y}%`,
                      transform:"translate(-50%,-50%)"
                    }}
                  >
                    {player?(
                      <FieldPlayer player={player}/>
                    ):(
                      <div className="w-14 h-14 rounded-full border border-white/40 bg-white/10 flex items-center justify-center text-[10px]">
                        {slot}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* BENCH */}
            <div className="mt-6 bg-black/40 p-4 rounded-xl w-[750px]">
              <h3 className="mb-3 font-semibold">Auswechselbank</h3>
              <div className="flex gap-4 flex-wrap">
                {[...Array(7)].map((_,i)=>{
                  const p=benchPlayers[i];
                  return(
                    <div key={i} className="flex flex-col items-center">
                      {p? <Circle player={p}/>:
                        <div className="w-14 h-14 border border-white/40 rounded-full"/>}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* SQUAD LIST */}
          <div className="w-[420px] bg-black/40 p-6 rounded-xl">
            <h3 className="mb-4 font-semibold">Kader</h3>
            {players.map(p=>
              <PlayerCard key={p._id} player={p}/>
            )}
          </div>

        </div>
      </div>

      <DragOverlay>
        {dragging&&<Circle player={dragging}/>}
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
      <div className="font-semibold">{player.firstName} {player.lastName}</div>
      <div className="text-xs text-gray-400">
        {player.age} Jahre • {player.positions.join(", ")}
      </div>
      <div className="text-yellow-400 text-xs">
        {"★".repeat(Math.round(player.stars))}
      </div>
    </div>
  );
}

function FieldPlayer({player}){
  const {attributes,listeners,setNodeRef}=useDraggable({id:`field-${player._id}`});
  return(
    <div ref={setNodeRef} {...listeners} {...attributes}
      className="flex flex-col items-center cursor-grab">
      <Circle player={player}/>
    </div>
  );
}

function Circle({player}){
  return(
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-xs font-bold">
        {player.positions[0]}
      </div>
      <div className="text-xs mt-1">{player.lastName}</div>
    </div>
  );
}