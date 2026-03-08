function chooseFormationByPhilosophy(players, philosophy){

let strikers = 0;
let wingers = 0;
let cams = 0;

players.forEach(p=>{

const pos = p.positions || [];

if(pos.includes("ST")) strikers++;
if(pos.includes("LW") || pos.includes("RW")) wingers++;
if(pos.includes("CAM")) cams++;

});

/* ================= BALLBESITZ ================= */

if(philosophy === "Ballbesitz"){

if(cams >=1) return "4-2-3-1";
return "4-3-3";

}

/* ================= GEGENPRESSING ================= */

if(philosophy === "Gegenpressing"){

if(wingers >=2) return "4-3-3";
return "4-4-2";

}

/* ================= KONTER ================= */

if(philosophy === "Kontern"){

if(strikers >=2) return "4-4-2";
return "3-5-2";

}

/* ================= DEFENSIV ================= */

if(philosophy === "Mauern"){

return "3-5-2";

}

/* ================= FALLBACK ================= */

return "4-3-3";

}

module.exports = { chooseFormationByPhilosophy };