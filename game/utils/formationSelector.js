function selectBestFormation(players){

let strikers = 0;
let wingers = 0;
let cams = 0;
let cms = 0;
let defenders = 0;

players.forEach(p=>{

const pos = p.positions || [];

if(pos.includes("ST")) strikers++;

if(pos.includes("LW") || pos.includes("RW")) wingers++;

if(pos.includes("CAM")) cams++;

if(pos.includes("CM") || pos.includes("CDM")) cms++;

if(pos.includes("CB") || pos.includes("LB") || pos.includes("RB"))
defenders++;

});

/* ================= ENTSCHEIDUNG ================= */

/* Stark auf Flügeln */

if(strikers >= 1 && wingers >= 2 && defenders >= 4){
return "4-3-3";
}

/* Zwei Stürmer */

if(strikers >= 2 && defenders >= 4){
return "4-4-2";
}

/* Spielmacher vorhanden */

if(strikers >= 1 && cams >= 1 && defenders >= 4){
return "4-2-3-1";
}

/* Viele Mittelfeldspieler */

if(strikers >= 2 && cms >= 3 && defenders >= 3){
return "3-5-2";
}

/* Fallback */

return "4-4-2";

}

module.exports = { selectBestFormation };